import { Button } from "@/components/ui/button";

export default function MediaBin() {
  return (
    <div className="h-full bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
      <h2 className="text-sm font-bold text-zinc-100 mb-4 tracking-wider uppercase">
        Media Bin
      </h2>
      <Button
        variant="secondary"
        className="w-full text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
      >
        + Import Media
      </Button>
      <div className="flex-1 mt-4 border-2 border-dashed border-zinc-700/50 rounded-lg flex items-center justify-center">
        <p className="text-xs text-zinc-500">No media imported</p>
      </div>
    </div>
  );
}
