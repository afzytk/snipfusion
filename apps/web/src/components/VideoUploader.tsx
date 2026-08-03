import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";

interface VideoUploaderProps {
  ffmpeg: FFmpeg;
}

const VideoUploader = ({ ffmpeg }: VideoUploaderProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null,
  );
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      console.log("File captured successfully:", file.name);
    }
  };

  //Video Trimming
  const handleTrimVideo = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    console.log("Writing file to WebAssembly memory...");

    // 1. Write the file to FFmpeg's virtual file system
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

    console.log("Processing video...");

    // 2. Run the FFmpeg command (Start at 0 seconds, duration 5 seconds)
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-ss",
      "00:00:00",
      "-t",
      "5",
      "output.mp4",
    ]);

    console.log("Reading processed file...");

    // 3. Read the result back from the virtual file system
    const data = await ffmpeg.readFile("output.mp4");

    // 4. Create a URL so the browser can play the new video
    const url = URL.createObjectURL(
      new Blob([data as any], { type: "video/mp4" }),
    );
    setProcessedVideoUrl(url);
    setIsProcessing(false);
  };
  return (
    <div className="flex flex-col gap-4 justify-center m-4 items-center">
      <h1 className="text-2xl color">Upload a video</h1>
      <p className="text-gray-600">Select an Mp4 file to begin editing</p>
      <Input
        type="file"
        accept="video/*"
        className="cursor-pointer hover:border-blue-400"
        onChange={handleFileChange}
      />

      {videoFile && (
        <div className="mt-6 w-full flex flex-col items-center">
          <p className="text-sm font-medium text-zinc-700 mb-2">Preview:</p>
          <video
            controls
            className="w-full max-w-lg rounded-lg shadow-md bg-black"
            src={URL.createObjectURL(videoFile)}
          />
          <Button
            className="mt-4"
            onClick={handleTrimVideo}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing... ⏳" : "Trim First 5 Seconds ✂️"}
          </Button>

          {processedVideoUrl && (
            <div className="mt-6 w-full flex flex-col items-center border-t border-zinc-200 pt-6">
              <p className="text-sm font-bold text-green-600 mb-2">
                Final Trimmed Output:
              </p>
              <video
                controls
                className="w-full max-w-lg rounded-lg border-4 border-green-500 shadow-md bg-black"
                src={processedVideoUrl}
              />
              <a href={processedVideoUrl} download="trimmed_video.mp4">
                <Button className="mt-4" variant="outline">
                  Download Video ⬇️
                </Button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
