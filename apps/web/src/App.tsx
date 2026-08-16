import { Button } from "@/components/ui/button";
import MediaBin from "./components/MediaBin";
import Player from "./components/Player";
import Timeline from "./components/Timeline";

export default function App() {
  return (
    <div className="h-screen w-screen bg-zinc-950 text-white flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
          <h1 className="font-bold text-zinc-100 tracking-wider">SNIPFUSION</h1>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Export Video
        </Button>
      </div>

      {/* Media Bin + Player */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 shrink-0">
          <MediaBin />
        </div>
        <div className="flex-1 relative">
          <Player />
        </div>
      </div>

      {/* Timeline */}
      <div className="h-[35%] min-h-[250px] shrink-0">
        <Timeline />
      </div>
    </div>
  );
}
