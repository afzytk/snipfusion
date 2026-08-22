import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";

export default function Player() {
  const currentTime = useEditorStore((state) => state.currentTime);
  const updateCurrentTime = useEditorStore((state) => state.updateCurrentTime);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const setIsPlaying = useEditorStore((state) => state.setIsPlaying);
  const timelineItems = useEditorStore((state) => state.timelineItems);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const activeClip = timelineItems.find(
    (item) =>
      currentTime >= item.startTime &&
      currentTime < item.startTime + item.duration,
  );

  // 1. Draw Frame Helper
  const drawFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  // 2. Load the File securely
  useEffect(() => {
    if (activeClip && activeClip.file) {
      const url = URL.createObjectURL(activeClip.file);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoUrl("");
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeClip?.id]);

  // 3. THE FIX: The Real-Time Playback Engine
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const video = videoRef.current;

      if (isPlaying) {
        // If a video is playing, let its native engine drive the red playhead!
        if (video && activeClip && !video.paused) {
          useEditorStore
            .getState()
            .updateCurrentTime(activeClip.startTime + video.currentTime);
        } else {
          // If there is an empty gap on the timeline, manually push time forward
          const deltaTime = (time - lastTime) / 1000;
          useEditorStore
            .getState()
            .updateCurrentTime(
              useEditorStore.getState().currentTime + deltaTime,
            );
        }

        // Constantly draw frames to the canvas!
        drawFrame();
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      // Start normal HTML5 video playback
      if (videoRef.current && activeClip) {
        videoRef.current
          .play()
          .catch((e) => console.log("Playback blocked:", e));
      }
      animationFrameId = requestAnimationFrame(loop);
    } else {
      // Pause normal playback
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, activeClip]);

  // 4. MANUAL SCRUBBING (When paused and user clicks the timeline)
  useEffect(() => {
    const video = videoRef.current;
    // We ONLY seek manually if the video is currently PAUSED
    if (!video || !activeClip || isPlaying) return;

    const localTime = currentTime - activeClip.startTime;
    if (Math.abs(video.currentTime - localTime) > 0.05) {
      video.currentTime = localTime;
    }
  }, [currentTime, activeClip, isPlaying]);

  return (
    <div className="h-full bg-black flex flex-col items-center p-4">
      {/* 1. FLEX-1 MIN-H-0: This forces the canvas to shrink if your screen is small! */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center mb-4 mt-2">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="max-h-full max-w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl object-contain"
        />
      </div>

      {/* 2. SHRINK-0: This guarantees the controls are never pushed off the screen */}
      <div className="h-12 shrink-0 flex items-center justify-center gap-4 w-full bg-zinc-950/50 rounded-full max-w-sm border border-zinc-800">
        <Button
          variant="secondary"
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-24 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </Button>
        <span className="text-zinc-400 font-mono text-sm w-16 text-center">
          {currentTime.toFixed(2)}s
        </span>
      </div>

      {/* Hidden Video Engine */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        onSeeked={drawFrame}
        onLoadedData={drawFrame}
      />
    </div>
  );
}
