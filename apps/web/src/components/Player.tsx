export default function Player() {
  return (
    <div className="h-full bg-black flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-4xl aspect-video bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex items-center justify-center">
        <p className="text-zinc-600 font-medium">Canvas Preview</p>
      </div>
    </div>
  );
}
