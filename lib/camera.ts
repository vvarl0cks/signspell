/**
 * camera.ts
 * Camera management abstraction for SignSpell.
 * Handles mobile vs desktop detection, getUserMedia constraints,
 * device enumeration, Logitech/external USB camera selection, and robust fallback logic.
 */

export type FacingMode = "user" | "environment";

/**
 * Detect mobile device heuristically.
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
  const lowCPU =
    typeof navigator !== "undefined" && navigator.hardwareConcurrency < 4;
  return narrowScreen || lowCPU;
}

/**
 * Build getUserMedia constraints based on device type, facingMode, or specific deviceId.
 * IMPORTANT: On desktop PCs with USB webcams (Logitech, Elgato, Razer, etc.),
 * facingMode MUST NOT be requested when no deviceId is provided, because external USB
 * webcams on Windows do not report facingMode and Chrome will reject overconstrained requests.
 */
export function buildConstraints(
  facingMode: FacingMode = "user",
  deviceId?: string | null
): MediaStreamConstraints {
  const mobile = isMobile();

  // 1. Specific device requested by deviceId (external webcam or selected camera)
  if (deviceId) {
    return {
      video: {
        deviceId: { ideal: deviceId },
        width: mobile ? { ideal: 640 } : { ideal: 1280 },
        height: mobile ? { ideal: 480 } : { ideal: 720 },
      },
      audio: false,
    };
  }

  // 2. Mobile device — use facingMode to pick front/back camera
  if (mobile) {
    return {
      video: {
        facingMode,
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 30 },
      },
      audio: false,
    };
  }

  // 3. Desktop PC — DO NOT include facingMode constraint so external USB webcams work natively!
  return {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
    audio: false,
  };
}

export class CameraManager {
  private stream: MediaStream | null = null;
  private currentFacingMode: FacingMode = "user";
  private currentDeviceId: string | null = null;
  private devices: MediaDeviceInfo[] = [];

  /**
   * Enumerate available video input devices.
   */
  async enumerateVideoDevices(): Promise<MediaDeviceInfo[]> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
      return [];
    }
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      this.devices = allDevices.filter((d) => d.kind === "videoinput");
      return this.devices;
    } catch (e) {
      console.warn("Failed to enumerate video devices:", e);
      return [];
    }
  }

  async startCamera(
    videoEl: HTMLVideoElement,
    facingMode: FacingMode = "user",
    deviceId?: string | null
  ): Promise<MediaStream> {
    this.stopCamera();

    this.currentFacingMode = facingMode;
    this.currentDeviceId = deviceId ?? null;

    let stream: MediaStream | null = null;

    // Stage 1: Try tailored constraints
    try {
      const constraints = buildConstraints(facingMode, deviceId);
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (primaryErr) {
      console.warn("Primary camera constraint failed, attempting fallback:", primaryErr);

      // Stage 2: Fallback — try with deviceId or basic resolution
      try {
        const fallbackConstraints: MediaStreamConstraints = deviceId
          ? { video: { deviceId: { ideal: deviceId } }, audio: false }
          : { video: true, audio: false };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      } catch (secondaryErr) {
        console.warn("Secondary camera constraint failed, attempting bare { video: true }:", secondaryErr);

        // Stage 3: Absolute bare minimum fallback
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
    }

    if (!stream) {
      throw new Error("Unable to obtain video stream from any camera device.");
    }

    this.stream = stream;
    videoEl.srcObject = stream;

    // Track active device ID from current stream track
    const activeTrack = stream.getVideoTracks()[0];
    if (activeTrack) {
      const settings = activeTrack.getSettings();
      if (settings.deviceId) {
        this.currentDeviceId = settings.deviceId;
      }
    }

    // Wait for video metadata safely (with instant readyState check + 1.5s fallback timeout)
    await new Promise<void>((resolve) => {
      if (videoEl.readyState >= 1 && videoEl.videoWidth > 0) {
        resolve();
        return;
      }

      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          videoEl.removeEventListener("loadedmetadata", finish);
          videoEl.removeEventListener("loadeddata", finish);
          videoEl.removeEventListener("error", finish);
          resolve();
        }
      };

      videoEl.addEventListener("loadedmetadata", finish);
      videoEl.addEventListener("loadeddata", finish);
      videoEl.addEventListener("error", finish);
      setTimeout(finish, 1000);
    });

    try {
      await videoEl.play();
    } catch (playErr) {
      console.warn("videoEl.play() warning:", playErr);
    }

    // Re-enumerate devices now that permission is granted (to populate device labels)
    await this.enumerateVideoDevices();

    return stream;
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  /**
   * Cycle to next camera device or flip facing mode.
   */
  async flipCamera(videoEl: HTMLVideoElement): Promise<MediaStream> {
    if (this.devices.length > 1) {
      const currentIdx = this.devices.findIndex(
        (d) => d.deviceId === this.currentDeviceId
      );
      const nextIdx = (currentIdx + 1) % this.devices.length;
      const nextDevice = this.devices[nextIdx];
      return this.startCamera(videoEl, this.currentFacingMode, nextDevice.deviceId);
    }

    const nextFacing: FacingMode =
      this.currentFacingMode === "user" ? "environment" : "user";
    return this.startCamera(videoEl, nextFacing, null);
  }

  async switchDevice(videoEl: HTMLVideoElement, deviceId: string): Promise<MediaStream> {
    return this.startCamera(videoEl, this.currentFacingMode, deviceId);
  }

  get facingMode(): FacingMode {
    return this.currentFacingMode;
  }

  get selectedDeviceId(): string | null {
    return this.currentDeviceId;
  }

  get availableDevices(): MediaDeviceInfo[] {
    return this.devices;
  }

  get isActive(): boolean {
    return this.stream !== null && this.stream.active;
  }
}
