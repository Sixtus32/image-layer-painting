import React, { useMemo } from "react";
import { Image, Layer, Rect } from "react-konva";

const BackgroundImage = ({ backgroundImageUrl, size }) => {
  const image = useMemo(() => {
    const imageObj = new window.Image();
    imageObj.src = backgroundImageUrl;
    return imageObj;
  }, [backgroundImageUrl]);
  return (
    <Layer>
        <Rect x={100} y={100} width={100} height={100}/>
      <Image image={image} />
    </Layer>
  );
};

export default BackgroundImage;

