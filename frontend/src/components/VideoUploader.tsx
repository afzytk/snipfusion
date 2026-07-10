import { Input } from "@/components/ui/input";

const VideoUploader = () => {
  return (
    <div className="flex flex-col gap-4 justify-center m-4 items-center">
      <h1 className="text-2xl color">Upload a video</h1>
      <p className="text-gray-600">Select an Mp4 file to begin editing</p>
      <Input
        type="file"
        accept="video"
        className="cursor-pointer hover:border-blue-400"
      />
    </div>
  );
};

export default VideoUploader;
