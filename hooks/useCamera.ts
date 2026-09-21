"use client";

/**
 * useCamera.ts
 * React hook wrapping CameraManager.
 * Manages camera permission state machine, device enumeration (external webcams),
 * auto-request on mount, device switching, and flip controls.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CameraManager, FacingMode } from "@/lib/camera";

export type CameraState =
  | "idle"        // Initial state before camera request
  | "requesting"  // getUserMedia in flight — show spinner / browser permission popup
  | "active"      // Camera running — show video
  | "denied"      // Permission denied — show retry message
  | "error";      // Other error (device busy, etc.)

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  state: CameraState;
  facingMode: FacingMode;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  errorMessage: string | null;
  requestCamera: (deviceId?: string) => Promise<void>;
  switchDevice: (deviceId: string) => Promise<void>;
  flipCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(autoRequest: boolean = true): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const managerRef = useRef<CameraManager>(new CameraManager());

  const [state, setState] = useState<CameraState>("idle");
  const [facingMode, setFacingMode] = useState<FacingMode>("user");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasAutoRequestedRef = useRef(false);

  const updateDevices = useCallback(async () => {
    const list = await managerRef.current.enumerateVideoDevices();
    setDevices(list);
    setSelectedDeviceId(managerRef.current.selectedDeviceId);
  }, []);

  const requestCamera = useCallback(async (deviceId?: string) => {
    setState("requesting");
    setErrorMessage(null);

    // If videoRef is not attached yet, wait for DOM element (up to 2 seconds)
    let videoEl = videoRef.current;
    if (!videoEl) {
      for (let i = 0; i < 20; i++) {
        await new Promise((res) => setTimeout(res, 100));
        if (videoRef.current) {
          videoEl = videoRef.current;
          break;
        }
      }
    }

    if (!videoEl) {
      setState("error");
      setErrorMessage("Video display element not ready. Please try again.");
      return;
    }

    try {
      await managerRef.current.startCamera(videoEl, "user", deviceId);
      setFacingMode(managerRef.current.facingMode);
      setSelectedDeviceId(managerRef.current.selectedDeviceId);
      await updateDevices();
      setState("active");
    } catch (err: unknown) {
      console.error("useCamera requestCamera error:", err);
      const error = err as DOMException;
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setState("denied");
        setErrorMessage(
          "Camera access was denied. Please click the camera icon in your browser address bar to allow camera access."
        );
      } else if (error.name === "NotFoundError") {
        setState("error");
        setErrorMessage("No camera found on this device. Please connect a webcam.");
      } else if (error.name === "NotReadableError") {
        setState("error");
        setErrorMessage(
          "Camera is in use by another app (e.g. Zoom, Teams, Discord). Please close other apps using the camera."
        );
      } else {
        setState("error");
        setErrorMessage(`Camera error (${error.name || "Error"}): ${error.message || "Could not start camera."}`);
      }
    }
  }, [updateDevices]);

  const switchDevice = useCallback(async (deviceId: string) => {
    if (!videoRef.current || state !== "active") return;
    try {
      await managerRef.current.switchDevice(videoRef.current, deviceId);
      setSelectedDeviceId(managerRef.current.selectedDeviceId);
      await updateDevices();
    } catch (err: unknown) {
      const error = err as DOMException;
      setErrorMessage(`Failed to switch camera: ${error.message || "Unknown error"}`);
    }
  }, [state, updateDevices]);

  const flipCamera = useCallback(async () => {
    if (!videoRef.current || state !== "active") return;
    try {
      await managerRef.current.flipCamera(videoRef.current);
      setFacingMode(managerRef.current.facingMode);
      setSelectedDeviceId(managerRef.current.selectedDeviceId);
      await updateDevices();
    } catch {
      // Flip failed — silently ignore
    }
  }, [state, updateDevices]);

  const stopCamera = useCallback(() => {
    managerRef.current.stopCamera();
    setState("idle");
  }, []);

  // Auto-request camera on mount if autoRequest is true
  useEffect(() => {
    if (autoRequest && !hasAutoRequestedRef.current) {
      hasAutoRequestedRef.current = true;
      // Trigger requestCamera on next tick so DOM is ready
      setTimeout(() => {
        requestCamera();
      }, 50);
    }
  }, [autoRequest, requestCamera]);

  // Listen for device changes (plugging in / unplugging USB webcam)
  useEffect(() => {
    const handleDeviceChange = () => {
      updateDevices();
    };

    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    }

    return () => {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      }
    };
  }, [updateDevices]);

  // Cleanup on unmount
  useEffect(() => {
    const manager = managerRef.current;
    return () => {
      manager.stopCamera();
    };
  }, []);

  return {
    videoRef,
    state,
    facingMode,
    devices,
    selectedDeviceId,
    errorMessage,
    requestCamera,
    switchDevice,
    flipCamera,
    stopCamera,
  };
}
