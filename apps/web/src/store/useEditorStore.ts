import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Represents a single clip on the timeline
export interface TimelineItem {
  id: string; // Unique ID for React rendering keys
  type: "video" | "audio" | "text"; // Type of asset
  file?: File; // The uploaded media file
  content?: string; // The text content (if type is 'text')
  startTime: number; // Start position on the timeline (in seconds)
  duration: number; // Length of the clip (in seconds)
}

// Global state contract for the editor
interface EditorState {
  timelineItems: TimelineItem[]; // All clips placed on the timeline
  currentTime: number; // Current playhead position (in seconds)

  addVideo: (file: File, duration: number) => void; // Adds a video clip
  updateCurrentTime: (time: number) => void; // Moves the playhead scrubber
  updateItemStartTime: (id: string, newStartTime: number) => void;
}

// Zustand global store
export const useEditorStore = create<EditorState>((set) => ({
  timelineItems: [],
  currentTime: 0,

  // Adds a new video to the absolute beginning (0:00) of the timeline
  addVideo: (file, duration) =>
    set((state) => ({
      timelineItems: [
        ...state.timelineItems,
        {
          id: uuidv4(),
          type: "video",
          file: file,
          startTime: 0,
          duration: duration,
        },
      ],
    })),

  updateItemStartTime: (id, newStartTime) =>
    set((state) => ({
      timelineItems: state.timelineItems.map((item) =>
        item.id === id
          ? { ...item, startTime: Math.max(0, newStartTime) }
          : item,
      ),
    })),

  // Updates the timeline playhead position
  updateCurrentTime: (time) => set({ currentTime: time }),
}));
