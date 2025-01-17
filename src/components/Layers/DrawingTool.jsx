import React from "react";
import { Circle, Layer, Line } from "react-konva";

const DrawingTool = ({ tool, lines, strokeWidth, cursorPosition }) => {
  return (
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
      {cursorPosition && (
        <Circle
          key={`${tool}`}
          x={cursorPosition.x}
          y={cursorPosition.y}
          radius={strokeWidth / 2}
          stroke={tool === "eraser" ? "yellow" : `red`}
          fill="transparent"
        />
      )}
    </Layer>
  );
};

export default DrawingTool;
