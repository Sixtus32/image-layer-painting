import { useEffect, useState } from "react";
import { throttleWrite } from "../utils/utils";

const useCursorGhost = (tool, stageRef) => {
  const [cursorPosition, setCursorPosition] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      throttleWrite(() => {
        if (!["pen", "eraser", "ai"].includes(tool)) {
          setCursorPosition(null);
          return;
        }

        const stage = stageRef.current;
        if (!stage) return;

        const target = e.target;
        if (target.tagName === "CANVAS") {
          const position = stage.getPointerPosition();
          if (position) {
            setCursorPosition(position);
          } else {
            setCursorPosition(null);
          }
        } else {
          setCursorPosition(null);
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
    };
  }, [tool, stageRef]);

  return { cursorPosition };
};

export default useCursorGhost;
