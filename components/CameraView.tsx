"use client";

import { useRef } from "react";
import { type CameraState } from "@/hooks/useCamera";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  state: CameraState;
  errorMessage: string | null;
  devices?: MediaDeviceInfo[];
  selectedDeviceId?: string | null;
  onRequestCamera: (deviceId?: string) => void;
  onSwitchDevice?: (deviceId: string) => void;
  onFlipCamera: () => void;
  showFlip?: boolean;
}

export default function CameraView({
  videoRef,
  canvasRef,
  state,
  errorMessage,
  devices = [],
  selectedDeviceId,
  onRequestCamera,
  onSwitchDevice,
  onFlipCamera,
  showFlip = true,
}: CameraViewProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = canvasRef ?? internalCanvasRef;

  return (
    <div className="relative w-full aspect-video bg-surface rounded-xl overflow-hidden border border-border">
      {/* ── IDLE: Enable Camera prompt ── */}
      {state === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 slide-up">
          <div className="w-20 h-20 rounded-2xl bg-panel border border-border flex items-center justify-center">
            <CameraIcon className="w-10 h-10 text-ink-mid" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-mono-display font-semibold text-ink-high text-lg">
              Camera Access Needed
            </p>
            <p className="text-ink-mid text-sm max-w-xs leading-relaxed">
              SignSpell uses your camera to track hand signs in real time.
              No video is recorded or stored.
            </p>
          </div>
          <button
            id="enable-camera-btn"
            onClick={() => onRequestCamera()}
            className="
              px-6 py-3 rounded-xl font-mono-display font-semibold text-void text-sm
              bg-phosphor hover:bg-phosphor-dim
              transition-all duration-200
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-phosphor focus:ring-offset-2 focus:ring-offset-surface
            "
          >
            Enable Camera
          </button>
        </div>
      )}

      {/* ── REQUESTING: Spinner ── */}
      {state === "requesting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 slide-up">
          <div className="w-10 h-10 rounded-full border-2 border-border border-t-phosphor animate-spin" />
          <p className="text-ink-mid text-sm font-mono-display">
            Waiting for permission…
          </p>
        </div>
      )}

      {/* ── DENIED / ERROR: Retry message ── */}
      {(state === "denied" || state === "error") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 slide-up">
          <div className="w-20 h-20 rounded-2xl bg-panel border border-danger/30 flex items-center justify-center">
            <LockIcon className="w-10 h-10 text-danger" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-mono-display font-semibold text-ink-high text-base">
              {state === "denied" ? "Camera Access Denied" : "Camera Error"}
            </p>
            <p className="text-ink-mid text-sm max-w-xs leading-relaxed">
              {errorMessage ??
                "Could not access camera. Please check your browser permissions or camera connection."}
            </p>
          </div>
          <button
            id="retry-camera-btn"
            onClick={() => onRequestCamera()}
            className="
              px-6 py-3 rounded-xl font-mono-display font-semibold text-sm
              border border-border text-ink-high
              hover:border-phosphor hover:text-phosphor
              transition-all duration-200
              active:scale-95
            "
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── ACTIVE: Video + Canvas overlay ── */}
      <video
        ref={videoRef}
        id="camera-video"
        autoPlay
        playsInline
        muted
        className={`
          w-full h-full object-cover video-mirror
          transition-opacity duration-300
          ${state === "active" ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Canvas overlay — drawn in mirrored coordinate space */}
      <canvas
        ref={activeCanvasRef}
        id="landmark-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* ── Device selector dropdown (if multiple cameras available) ── */}
      {state === "active" && devices.length > 1 && onSwitchDevice && (
        <div className="absolute top-3 left-3 z-20">
          <select
            id="camera-device-select"
            value={selectedDeviceId ?? ""}
            onChange={(e) => onSwitchDevice(e.target.value)}
            className="
              px-3 py-1.5 rounded-lg
              bg-void/80 backdrop-blur-md
              border border-border
              font-mono-display text-xs text-ink-high
              focus:outline-none focus:border-phosphor
              cursor-pointer
              max-w-[200px] sm:max-w-[260px] truncate
            "
            aria-label="Select camera device"
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Camera flip / cycle button ── */}
      {state === "active" && showFlip && (
        <button
          id="flip-camera-btn"
          onClick={onFlipCamera}
          aria-label="Flip or switch camera"
          title={devices.length > 1 ? "Switch to next camera" : "Flip camera"}
          className="
            absolute bottom-3 right-3
            w-12 h-12 rounded-xl
            bg-void/70 backdrop-blur-sm
            border border-border
            flex items-center justify-center
            text-ink-mid hover:text-phosphor
            hover:border-phosphor/50
            transition-all duration-200
            active:scale-90
            z-10
          "
        >
          <FlipIcon className="w-5 h-5" />
        </button>
      )}

      {/* ── Scanline overlay (retro texture) ── */}
      {state === "active" && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          }}
        />
      )}
    </div>
  );
}

// ── Inline SVG Icons ──────────────────────────────────────────────────────────

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function FlipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
