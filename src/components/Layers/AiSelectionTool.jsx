import React, { useEffect, useRef } from "react";
import { Image, Layer, Line } from "react-konva";
import ReactDOMServer from "react-dom/server";

const AiSelectionTool = ({ aiPointsSelection, cursorPosition, svgUrl }) => {
  const imageRef = useRef(null);

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
    <Layer>
      <>
        <Line
          points={aiPointsSelection}
          stroke="white"
          strokeWidth={1.5}
          lineJoin="round"
          dash={[4, 4]}
          strokeScaleEnabled
        />
        <Line
          points={aiPointsSelection}
          stroke="black"
          strokeWidth={1.5}
          lineJoin="round"
          dash={[4, 4]}
          strokeScaleEnabled
        />
      </>
      {cursorPosition && (
        <Image
          ref={imageRef}
          x={cursorPosition.x - 4}
          y={cursorPosition.y - 21}
          width={25}
          height={25}
          listening={false}
        />
      )}
    </Layer>
  );
};

export default AiSelectionTool;
