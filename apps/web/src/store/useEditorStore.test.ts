import { describe, it, expect } from "vitest";
import { useEditorStore } from "./useEditorStore";

describe("Zustand Editor Store", () => {
  it("should initialize with an empty timeline and 0 currentTime", () => {
    // 1. Get the current state of the database
    const state = useEditorStore.getState();

    // 2. Assert (expect) that it matches our default rules
    expect(state.timelineItems.length).toBe(0);
    expect(state.currentTime).toBe(0);
  });

  it("should successfully add a video to the timeline items", () => {
    // 1. Create a fake HTML5 File object in memory
    const fakeFile = new File(["dummy content"], "vacation.mp4", {
      type: "video/mp4",
    });
    const fakeDuration = 15;

    // 2. ACT: Call the addVideo function directly from the store
    useEditorStore.getState().addVideo(fakeFile, fakeDuration);

    // 3. ASSERT: Fetch the updated state and verify the math/logic worked
    const updatedState = useEditorStore.getState();

    expect(updatedState.timelineItems.length).toBe(1); // Array should now have 1 item
    expect(updatedState.timelineItems[0].type).toBe("video"); // Type should be 'video'
    expect(updatedState.timelineItems[0].file?.name).toBe("vacation.mp4"); // File name must match
    expect(updatedState.timelineItems[0].duration).toBe(15); // Duration must match
    expect(updatedState.timelineItems[0].id).toBeDefined(); // UUID should be generated
  });
});
