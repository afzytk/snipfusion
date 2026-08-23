import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/useEditorStore";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function ExportButton() {
  const timelineItems = useEditorStore((state) => state.timelineItems);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    if (timelineItems.length === 0) return alert("Timeline is empty!");

    setIsExporting(true);
    setProgress(0);

    // 1. Boot up a fresh FFmpeg engine purely for exporting
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    console.log("Loading FFmpeg for export...");
    await ffmpeg.load();

    // 2. Sort the timeline items sequentially by their start time
    const sortedItems = [...timelineItems].sort(
      (a, b) => a.startTime - b.startTime,
    );

    // 3. Write all files to WebAssembly memory
    console.log("Writing files to memory...");
    const inputArgs: string[] = [];
    for (let i = 0; i < sortedItems.length; i++) {
      const fileName = `input${i}.mp4`;
      await ffmpeg.writeFile(fileName, await fetchFile(sortedItems[i].file!));
      inputArgs.push("-i", fileName);
    }

    // 4. THE COMPILER: Build the FFmpeg filter graph
    console.log("Compiling Filter Graph...");
    let filterComplex = "";

    // Step 4A: Scale EVERY video to exactly 1280x720 (Adds black bars if needed to maintain aspect ratio)
    for (let i = 0; i < sortedItems.length; i++) {
      filterComplex += `[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}]; `;
    }

    // Step 4B: Tell FFmpeg to stitch (concat) these newly scaled videos together
    for (let i = 0; i < sortedItems.length; i++) {
      filterComplex += `[v${i}][${i}:a]`;
    }
    filterComplex += `concat=n=${sortedItems.length}:v=1:a=1[outv][outa]`;

    // 5. Build the final execution array
    const finalCommand = [
      ...inputArgs,
      "-filter_complex",
      filterComplex,
      "-map",
      "[outv]",
      "-map",
      "[outa]",
      "-c:v",
      "libx264", // Standard MP4 video codec
      "-preset",
      "ultrafast", // Render as fast as possible in the browser
      "output.mp4",
    ];

    console.log("Executing FFmpeg command:", finalCommand.join(" "));
    await ffmpeg.exec(finalCommand);

    // 6. Read the final file and trigger a browser download!
    console.log("Rendering complete! Downloading...");
    const data = await ffmpeg.readFile("output.mp4");
    const url = URL.createObjectURL(
      new Blob([data as any], { type: "video/mp4" }),
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "snipfusion_final_cut.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsExporting(false);
  };

  return (
    <Button
      size="sm"
      onClick={handleExport}
      disabled={isExporting || timelineItems.length === 0}
      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
    >
      {isExporting ? `Rendering ${progress}%` : "Export Video"}
    </Button>
  );
}
