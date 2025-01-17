import React, { useEffect, useState } from "react";
import { Image, Layer } from "react-konva";

const BackgroundImage = ({ backgroundImageUrl, size }) => {
  const [ image, setImage] = useState(null);
  useEffect(() => {
    const imageObj = new window.Image();
    imageObj.src = backgroundImageUrl;
    imageObj.onload = () => {
      setImage(imageObj);
    }
    imageObj.onerror = () => {
      console.error('Error loading image:', backgroundImageUrl);
    }
  }, [backgroundImageUrl]);

  return (
    <>
      <Layer>{image && <Image image={image} />}</Layer>
    </>
  );
};

export default BackgroundImage;
