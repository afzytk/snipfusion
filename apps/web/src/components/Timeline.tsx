export default function Timeline() {
  return (
    <div className="h-full bg-zinc-950 border-t border-zinc-800 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-zinc-100 tracking-wider uppercase">
          Timeline
        </h2>
        <span className="text-xs text-zinc-500 font-mono">00:00:00:00</span>
      </div>

      <div className="relative h-24 bg-zinc-900 rounded-md border border-zinc-800 w-full flex items-center overflow-x-auto">
        <div className="absolute left-[10%] top-0 bottom-0 w-0.5 bg-red-600 z-10 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
          <div className="absolute -top-2 -left-1.5 w-3.5 h-3.5 bg-red-600 rounded-sm" />
        </div>
        <p className="text-xs text-zinc-600 ml-4">Video Track 1</p>
      </div>
    </div>
  );
}
