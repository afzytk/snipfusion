import { Input } from "@/components/ui/input";
import { useState } from "react";

const VideoUploader = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      console.log("File captured successfully:", file.name);
    }
  };
  return (
    <div className="flex flex-col gap-4 justify-center m-4 items-center">
      <h1 className="text-2xl color">Upload a video</h1>
      <p className="text-gray-600">Select an Mp4 file to begin editing</p>
      <Input
        type="file"
        accept="video"
        className="cursor-pointer hover:border-blue-400"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default VideoUploader;
