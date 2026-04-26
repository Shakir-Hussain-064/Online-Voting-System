import { useEffect, useRef, useState } from "react";

const WebcamCapture = ({ onCapture, label = "Capture Face" }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (_error) {
        setStreaming(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(imageDataUrl);
  };

  return (
    <div className="space-y-2">
      <video ref={videoRef} autoPlay playsInline muted className="h-44 w-full rounded-xl border border-slate-300 object-cover sm:h-52" />
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button"
        onClick={captureImage}
        disabled={!streaming}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {label}
      </button>
    </div>
  );
};

export default WebcamCapture;
