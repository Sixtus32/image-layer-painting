/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
import React, { useEffect, useRef, useState } from "react";
import { throttleWrite } from "../../utils/utils";
import { Image, Layer, Line, Rect, Stage } from "react-konva";
import BackgroundImage from "../ImageBackground";
import useCursorGhost from "../../hooks/useCursorGhost";
import useDrawingTool from "../../hooks/useDrawingTool";
import DrawingTool from "../Layers/DrawingTool";
import AiSelectionTool from "../Layers/AiSelectionTool";
import ToolIcon from "../TooIsIcon";
import { DefaultMouseIcon } from "../TooIsIcon/SvgIcons";
import ReactDOMServer from "react-dom/server";

const KonvaDrawer = ({ backgroundImageUrl }) => {
  const stageContainerRef = useRef(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const svgUrl = useState(<DefaultMouseIcon />);

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

  useEffect(() => {
    if (svgUrl) {
      // Convertir el JSX en una cadena SVG válida
      const svgString = ReactDOMServer.renderToStaticMarkup(svgUrl);
      const encodedData = encodeURIComponent(svgString);
      const img = new window.Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodedData}`;
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.image(img);
          imageRef.current.getLayer().batchDraw();
        }
      };
    }
  }, [svgUrl]);

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
            onTouchMove={handleTouchMove}
            style={{ cursor: "none"}}
            >
            <Layer>
              {backgroundImageUrl && (
                <BackgroundImage
                  backgroundImageUrl={backgroundImageUrl}
                  size={size}
                />
              )}
              <Rect width={100} height={100} fill="yellow" />
              {cursorPosition && (
                <Image
                  ref={imageRef}
                  x={cursorPosition.x - 8}
                  y={cursorPosition.y - 3}
                  width={25}
                  height={25}
                  listening={false}
                />
              )}
            </Layer>

            <DrawingTool
              tool={tool}
              lines={lines}
              strokeWidth={drawWidth}
              cursorPosition={cursorPosition}
            />
            <AiSelectionTool
              aiPointsSelection={aiSelectionActing}
              cursorPosition={cursorPosition}
              // svgUrl={<ToolIcon iconType={"ai"} />}
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
