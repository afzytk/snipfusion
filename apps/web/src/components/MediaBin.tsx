import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/useEditorStore";

export default function MediaBin() {
  const addVideo = useEditorStore((state) => state.addVideo);
  const timelineItems = useEditorStore((state) => state.timelineItems);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);

      addVideo(file, duration);
    };

    video.src = URL.createObjectURL(file);
    e.target.value = "";
  };

  return (
    <div className="h-full bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
      <h2 className="text-sm font-bold text-zinc-100 mb-4 tracking-wider uppercase">
        Media Bin
      </h2>

      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        variant="secondary"
        className="w-full text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
        onClick={() => fileInputRef.current?.click()}
      >
        + Import Media
      </Button>

      <div className="flex-1 mt-4 border-2 border-dashed border-zinc-700/50 rounded-lg p-2 overflow-y-auto flex flex-col gap-2">
        {timelineItems.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-zinc-500">No media imported</p>
          </div>
        ) : (
          timelineItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-3 rounded-md border border-zinc-700 flex flex-col shadow-sm transition-all hover:border-zinc-500 cursor-pointer"
            >
              <span className="text-xs text-zinc-300 font-medium truncate">
                {item.file?.name}
              </span>
              <span className="text-[10px] text-zinc-500 mt-1">
                Video • {item.duration}s
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
