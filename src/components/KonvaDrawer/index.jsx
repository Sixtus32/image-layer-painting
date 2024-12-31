/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
import React, { useEffect, useRef, useState } from "react";
import { throttleWrite } from "../../utils/utils";
import { Layer, Line, Stage } from "react-konva";
import BackgroundImage from "../ImageBackground";

const KonvaDrawer = ({ backgroundImageUrl, onSave }) => {
  const stageContainerRef = useRef(null);
  const stageRef = useRef(null);
  const isDrawing = useRef(false);

  // Herramientas
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState("pen");

  const [drawColor, setDrawColor] = useState("#df4b26");
  const [drawWidth, setDrawWidth] = useState(2);
  const [drawOpcity, setDrawOpcity] = useState(1);

  const [size, setSize] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [scale, setScale] = useState(1);

  const [isScalingDrawWidth, setIsScalingDrawWidth] = useState(true);
  const cursorGhostRef = useRef(null);

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      throttleWrite(() => {
        if (!["pen", "eraser"].includes(tool)) {
          return;
        }
        const target = e.target;
        if (target.tagName === "CANVAS") {
          if (e instanceof MouseEvent) {
            cursorGhostRef.current.style.opacity = "0.25";
            cursorGhostRef.current.style.left = e.pageX + "px";
            cursorGhostRef.current.style.top = e.pageY + "px";
          } else if (e.touches && e.touches.length === 1) {
            const touch = e.touches[0];
            cursorGhostRef.current.style.opacity = "0.25";
            cursorGhostRef.current.style.left = touch.pageX + "px";
            cursorGhostRef.current.style.top = touch.pageY + "px";
          }
        } else {
          cursorGhostRef.current.style.opacity = "0";
        }
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
    };
  }, [tool]);

  const startDraw = (e) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (stage) {
      const pos = stage.getPointerPosition();
      if (pos) {
        const scale = stage.scaleX();
        const pointerOffset = {
          x: (pos.x - stage.x()) / scale,
          y: (pos.y - stage.y()) / scale,
        };
        setLines([
          ...lines,
          {
            tool,
            points: [pointerOffset.x, pointerOffset.y],
            color: drawColor,
            width: drawWidth, // Usamos el drawWidth directamente
            opacity: drawOpcity,
          },
        ]);
      }
    }
  };

  const handleToolChange = (input) => {
    const value = typeof input === "string" ? input : input.target.value;
    setTool(String(value));
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    if (stage) {
      const point = stage?.getPointerPosition();
      if (point) {
        let lastLine = lines[lines.length - 1];
        const scale = stage.scaleX();
        const pointerOffset = {
          x: (point.x - stage.x()) / scale,
          y: (point.y - stage.y()) / scale,
        };
        lastLine.points = lastLine.points.concat([
          pointerOffset.x,
          pointerOffset.y,
        ]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
      }
    }
  };

  const endDraw = (e) => {
    if (isDrawing.current) {
      const stage = e.target.getStage();
      if (stage) {
        const point = stage?.getPointerPosition();
        if (point) {
          let lastLine = lines[lines.length - 1];
          const scale = stage.scaleX();
          const pointerOffset = {
            x: (point.x - stage.x()) / scale,
            y: (point.y - stage.y()) / scale,
          };
          lastLine.points = lastLine.points.concat([
            pointerOffset.x,
            pointerOffset.y,
          ]);
          lines.splice(lines.length - 1, 1, lastLine);
          setLines(lines.concat());
        }
      }
    }
    isDrawing.current = false;
  };

  const handleMouseDown = (e) => {
    if (["pen", "eraser"].includes(tool)) {
      startDraw(e);
    }
  };

  const handleTouchStart = (e) => {
    const touches = e.evt.touches;
    if (touches.length === 1) {
      if (["pen", "eraser"].includes(tool)) {
        startDraw(e);
      }
    }
  };

  const handleMouseUp = (e) => {
    endDraw(e);
  };

  const handleMouseMove = (e) => {
    e.evt.preventDefault();
    draw(e);
  };

  const handleTouchMove = (e) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    if (e.evt.touches.length === 2) {
      isDrawing.current = false;
    }
    if (isDrawing.current) {
      handleMouseMove(e);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "auto",
        display: "flex",
        flexDirection: "row",
        width: "55%",
      }}>
      <div ref={stageContainerRef} style={{ borderRight: "5px solid #ccc" }}>
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
            {backgroundImageUrl && (
              <BackgroundImage
                backgroundImageUrl={backgroundImageUrl}
                size={size}
              />
            )}
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.width}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
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
      <div
        id="cursorGhost"
        ref={cursorGhostRef}
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          height: drawWidth,
          width: drawWidth,
          borderRadius: "50%",
          border: "1px solid black",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default KonvaDrawer;
