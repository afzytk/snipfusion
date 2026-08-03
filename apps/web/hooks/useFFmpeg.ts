import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export const useFFmpeg = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      console.log("[FFmpeg]:", message);
    });

    console.log("Loading FFmpeg engine...");
    await ffmpeg.load();
    setIsLoaded(true);
    console.log("FFmpeg engine loaded successfully!");
  };
  return { isLoaded, loadFFmpeg, ffmpegRef };
};
