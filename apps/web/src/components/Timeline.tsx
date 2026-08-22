import { useEditorStore } from "@/store/useEditorStore";

export default function Timeline() {
  const timelineItems = useEditorStore((state) => state.timelineItems);

  const PIXELS_PER_SECOND = 20;

  return (
    <div className="h-full bg-zinc-950 border-t border-zinc-800 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-zinc-100 tracking-wider uppercase">
          Timeline
        </h2>
        <span className="text-xs text-zinc-500 font-mono">00:00:00:00</span>
      </div>

      {/* Video Track 1 Container */}
      <div className="relative h-24 bg-zinc-900 rounded-md border border-zinc-800 w-full overflow-x-auto overflow-y-hidden">
        <div className="absolute left-4 top-0 bottom-0 flex items-center z-0 pointer-events-none">
          <p className="text-xs text-zinc-600 select-none">Video Track 1</p>
        </div>

        {/* Rendering the clips from Zustand */}
        {timelineItems.map((video) => (
          <div
            key={video.id}
            className="absolute top-2 bottom-2 rounded-md bg-blue-600 border border-blue-400 opacity-80 cursor-pointer overflow-hidden z-10 hover:opacity-100 transition-opacity shadow-sm"
            style={{
              left: `${video.startTime * PIXELS_PER_SECOND}px`,
              width: `${video.duration * PIXELS_PER_SECOND}px`,
            }}
          >
            <p className="text-[10px] font-medium text-white p-1 truncate">
              {video.file?.name || "Video Clip"}
            </p>
          </div>
        ))}

        <div className="absolute left-[10%] top-0 bottom-0 w-0.5 bg-red-600 z-20 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
          <div className="absolute -top-2 -left-1.5 w-3.5 h-3.5 bg-red-600 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
