/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
import React, { useEffect, useRef, useState } from "react";
import { throttleWrite } from "../../utils/utils";
import { Layer, Line, Rect, Stage } from "react-konva";
import BackgroundImage from "../ImageBackground";
import useCursorGhost from "../../hooks/useCursorGhost";
import useDrawingTool from "../../hooks/useDrawingTool";
import DrawingTool from "../Layers/DrawingTool";
import AiSelectionTool from "../Layers/AiSelectionTool";
import ToolIcon from "../TooIsIcon";

const KonvaDrawer = ({ backgroundImageUrl, onSave }) => {
  const stageContainerRef = useRef(null);
  const stageRef = useRef(null);

  // Herramientas
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState("pen");

  const [drawColor, setDrawColor] = useState("#df4b26");
  const [drawWidth, setDrawWidth] = useState(2);

  // Ai points selection
  const [aiPointsSelection, setAiPointsSelection] = useState([]);

  const [size, setSize] = useState(null);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    aiSelectionActing,
  } = useDrawingTool(
    tool,
    lines,
    drawColor,
    drawWidth,
    setLines,
    aiPointsSelection,
    setAiPointsSelection
  );
  const { cursorPosition } = useCursorGhost(tool, stageRef);
  const [showSizeSlider, setShowSizeSlider] = useState(false);

  useEffect(() => {
    if (backgroundImageUrl) {
      const img = new window.Image();
      img.src = backgroundImageUrl;
    } else {
      const width =
        stageContainerRef.current && stageContainerRef.current.clientWidth;
      setSize({
        sceneWidth: width,
        sceneHeight: 400,
        scale: 1,
        stageWidth: width,
        stageHeight: 400,
      });
    }
  }, [backgroundImageUrl]);

  const handleToolChange = (input) => {
    const value = typeof input === "string" ? input : input.target.value;
    setTool(String(value));
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "auto",
        display: "flex",
        flexDirection: "row",
      }}>
      <div
        ref={stageContainerRef}
        style={{ borderRight: "5px solid #ccc", width: "100%" }}>
        {size && (
          <Stage
            width={size.stageWidth}
            height={size.stageHeight}
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}>
            <Layer>
              <Rect width={100} height={100} fill="yellow" />
            </Layer>
            {backgroundImageUrl && (
              <BackgroundImage
                backgroundImageUrl={backgroundImageUrl}
                size={size}
              />
            )}
            <DrawingTool
              tool={tool}
              lines={lines}
              strokeWidth={drawWidth}
              cursorPosition={cursorPosition}
            />
            <AiSelectionTool
              aiPointsSelection={aiSelectionActing}
              cursorPosition={cursorPosition}
              svgUrl={<ToolIcon iconType={"ai"} />}
            />
          </Stage>
        )}
      </div>
      <div>
        <div
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
          }}>
          <button onClick={() => handleToolChange("pen")}>Pen</button>
          <button onClick={() => handleToolChange("eraser")}>Eraser</button>
          <button onClick={() => handleToolChange("ai")}>Ai</button>
          <button onClick={() => setShowSizeSlider(!showSizeSlider)}>
            Toggle Size Slider
          </button>
          {showSizeSlider && (
            <input
              type="range"
              min="1"
              max="150"
              value={drawWidth}
              onChange={(e) => setDrawWidth(Number(e.target.value))}
            />
          )}
          <button onClick={() => setDrawColor("#000000")}>Black</button>
          <button onClick={() => setDrawColor("#FF0000")}>Red</button>
        </div>
      </div>
    </div>
  );
};

export default KonvaDrawer;
