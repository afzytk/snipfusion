import VideoUploader from "./components/VideoUploader";
import { Button } from "./components/ui/button";
import { useFFmpeg } from "./hooks/useFFmpeg";

const App = () => {
  const { isLoaded, loadFFmpeg, ffmpegRef } = useFFmpeg();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">SnipFusion</h1>

      {!isLoaded ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-600">
            The video engine requires downloading core files to your browser.
          </p>
          <Button onClick={loadFFmpeg}>Load Video Engine</Button>
        </div>
      ) : (
        <VideoUploader ffmpeg={ffmpegRef.current} />
      )}
    </div>
  );
};

export default App;
