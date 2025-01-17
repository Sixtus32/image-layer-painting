import { useCallback, useMemo, useRef, useState } from "react";

const useDrawingTool = (
  tool,
  lines,
  drawColor,
  drawWidth,
  setLines,
  aiPointsSelection,
  setAiPointsSelection
) => {
  const isDrawing = useRef(false);
  const isAi = useRef(false);
  const calculatePointerOffset = (stage, pos) => {
    const scale = stage.scaleX();
    return {
      x: (pos.x - stage.x()) / scale,
      y: (pos.y - stage.y()) / scale,
    };
  };

  // ai 0.

  // ai 1.
  const [aiChoiseActionStatus, setAiChoiseActionStatus] = useState(false);
  const [aiSelected, setAiSelected] = useState(false);
  // ai 2.
  const updateAiSelectionLine = useCallback((newPoints) => {
    if (!newPoints) return;
    setAiPointsSelection((prevLines) => {
      return [...prevLines, newPoints];
    });
  }, []);

  // ai 3.
  const aiSelectionActing = useMemo(
    () => aiPointsSelection.map(({ x, y }) => [x, y]).flat(),
    [aiPointsSelection]
  );

  const newAiSelection = useCallback(() => {
    setAiPointsSelection([]);
    setAiChoiseActionStatus(false);
    setAiSelected(true);
  }, []);

  // ai 4.

  const startAiDraw = useCallback(
    (e) => {
      // handle the reset of all selection
      newAiSelection();
      isAi.current = true;
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (stage && pos) {
        const pointerOffset = calculatePointerOffset(stage, pos);
        updateAiSelectionLine({ x: pointerOffset.x, y: pointerOffset.y });
      }
    },
    [updateAiSelectionLine, newAiSelection]
  );

  const addAiDraw = useCallback(
    (e) => {
      if (!aiSelected) return;
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (stage && pos) {
        const pointerOffset = calculatePointerOffset(stage, pos);
        updateAiSelectionLine({ x: pointerOffset.x, y: pointerOffset.y });
      }
    },
    [aiSelected, updateAiSelectionLine]
  );

  const endAiDraw = useCallback(() => {
    setAiSelected(false);
    updateAiSelectionLine(aiPointsSelection[0]);
    setAiChoiseActionStatus(true);
    isAi.current = false;
  }, [updateAiSelectionLine, aiPointsSelection]);

  const startDraw = useCallback(
    (e) => {
      isDrawing.current = true;
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (stage && pos) {
        const pointerOffset = calculatePointerOffset(stage, pos);
        setLines((prevLines) => [
          ...prevLines,
          {
            tool,
            points: [pointerOffset.x, pointerOffset.y],
            color: drawColor,
            width: drawWidth,
          },
        ]);
      }
    },
    [tool, drawColor, drawWidth, setLines]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing.current) return;
      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (stage && point) {
        const pointerOffset = calculatePointerOffset(stage, point);
        setLines((prevLines) => {
          const updatedLines = [...prevLines];
          const lastLine = { ...updatedLines[updatedLines.length - 1] };
          lastLine.points = lastLine.points.concat([
            pointerOffset.x,
            pointerOffset.y,
          ]);
          updatedLines[updatedLines.length - 1] = lastLine;
          return updatedLines;
        });
      }
    },
    [setLines]
  );

  const endDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      if (["pen", "eraser"].includes(tool)) {
        startDraw(e);
      } else if (["ai"].includes(tool)) {
        startAiDraw(e);
      }
    },
    [tool, startDraw, startAiDraw]
  );

  const handleTouchStart = useCallback(
    (e) => {
      const touches = e.evt.touches;
      if (touches.length === 1 && ["pen", "eraser"].includes(tool)) {
        startDraw(e);
      } else if (touches.length === 1 && ["ai"].includes(tool)) {
        startAiDraw(e);
      }
    },
    [tool, startDraw, startAiDraw]
  );

  const handleMouseUp = useCallback(() => {
    if (["pen", "eraser"].includes(tool)) {
      endDraw();
    } else if (["ai"].includes(tool)) {
      endAiDraw();
    }
  }, [endDraw, endAiDraw, tool]);

  const handleMouseMove = useCallback(
    (e) => {
      e.evt.preventDefault();
      if (["pen", "eraser"].includes(tool)) {
        draw(e);
      } else if (["ai"].includes(tool)) {
        addAiDraw(e);
      }
    },
    [draw, addAiDraw, tool]
  );

  const handleTouchMove = useCallback(
    (e) => {
      e.evt.preventDefault();
      const stage = e.target.getStage();
      if (!stage || e.evt.touches.length === 2) {
        isDrawing.current = false;
        isAi.current = false;
        return;
      }
      if (isDrawing.current) {
        draw(e);
      } else if (isAi.current) {
        addAiDraw(e);
      }
    },
    [draw, addAiDraw]
  );

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    aiSelectionActing,
  };
};

export default useDrawingTool;

// const useDrawingTool: (tool: any, lines: any, drawColor: any, drawWidth: any, setLines: any) => {
//     handleMouseDown: (e: any) => void;
//     handleMouseMove: (e: any) => void;
//     handleMouseUp: () => void;
//     handleTouchStart: (e: any) => void;
//     handleTouchMove: (e: any) => void;
// }
