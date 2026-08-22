import { useEditorStore, type TimelineItem } from "@/store/useEditorStore";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useDraggable } from "@dnd-kit/core";

const PIXELS_PER_SECOND = 20;

// --- 1. A new sub-component for the draggable clip ---
function DraggableClip({ video }: { video: TimelineItem }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: video.id,
    data: { video }, // Pass the video data to the drag event
  });

  // If the user is currently dragging, dnd-kit gives us the X pixel offset.
  // We add this temporary visual offset to the permanent left position.
  const visualXOffset = transform ? transform.x : 0;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute top-2 bottom-2 rounded-md bg-blue-600 border border-blue-400 opacity-80 cursor-grab active:cursor-grabbing overflow-hidden z-10 hover:opacity-100 transition-opacity shadow-sm"
      style={{
        left: `${video.startTime * PIXELS_PER_SECOND}px`,
        width: `${video.duration * PIXELS_PER_SECOND}px`,
        // Translate X pushes the div visually while dragging without changing the underlying DOM left property
        transform: `translateX(${visualXOffset}px)`,
      }}
    >
      <p className="text-[10px] font-medium text-white p-1 truncate pointer-events-none">
        {video.file?.name || "Video Clip"}
      </p>
    </div>
  );
}

// --- 2. The Main Timeline Component ---
export default function Timeline() {
  const currentTime = useEditorStore((state) => state.currentTime);
  const updateCurrentTime = useEditorStore((state) => state.updateCurrentTime);
  const timelineItems = useEditorStore((state) => state.timelineItems);
  const updateItemStartTime = useEditorStore(
    (state) => state.updateItemStartTime,
  );

  // 3. The Math: Convert dragged pixels back into seconds!
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active || delta.x === 0) return;

    // Retrieve the video object we attached to the drag event
    const video = active.data.current?.video as TimelineItem;

    // Pixels moved / Pixels per second = Seconds moved
    const secondsMoved = delta.x / PIXELS_PER_SECOND;

    // Calculate new start time and round to 2 decimal places for clean math
    const newStartTime =
      Math.round((video.startTime + secondsMoved) * 100) / 100;

    // Update the Zustand database!
    updateItemStartTime(video.id, newStartTime);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get the exact pixel the user clicked relative to the track container
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;

    // Convert pixels back into seconds using our scale factor
    const newTime = Math.max(0, clickX / PIXELS_PER_SECOND);

    // Update the Zustand database!
    updateCurrentTime(newTime);
  };

  return (
    <div className="h-full bg-zinc-950 border-t border-zinc-800 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-zinc-100 tracking-wider uppercase">
          Timeline
        </h2>
        <span className="text-xs text-zinc-500 font-mono">
          {currentTime.toFixed(2)}s
        </span>
      </div>

      <div
        className="relative h-24 bg-zinc-900 rounded-md border border-zinc-800 w-full overflow-x-auto overflow-y-hidden cursor-text"
        onClick={handleTrackClick}
      >
        <div className="absolute left-4 top-0 bottom-0 flex items-center z-0 pointer-events-none">
          <p className="text-xs text-zinc-600 select-none">Video Track 1</p>
        </div>

        {/* 4. DndContext wraps the items so they can be dragged */}
        <DndContext
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          {timelineItems.map((video) => (
            <DraggableClip key={video.id} video={video} />
          ))}
        </DndContext>

        <div
          className="absolute  top-0 bottom-0 w-0.5 bg-red-600 z-20 shadow-[0_0_10px_rgba(220,38,38,0.5)] pointer-events-none"
          style={{ left: `${currentTime * PIXELS_PER_SECOND}px` }}
        >
          <div className="absolute -top-2 -left-1.5 w-3.5 h-3.5 bg-red-600 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
