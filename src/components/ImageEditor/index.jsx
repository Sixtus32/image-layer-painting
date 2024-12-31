/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import KonvaDrawer from "../KonvaDrawer";

const ImageEditor = ({ onSave }) => {
  const [image, setImage] = useState(null);
  const [_, setDrawing] = useState(null);

  const imageSrc = useMemo(
    () => (image ? URL.createObjectURL(image) : undefined),
    [image]
  );

  // Maneja la carga de la imagen
  const handleImageUpload = (event) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div>
      <div>
        <h2>Bajar Imagen</h2>
        <input type="file" onChange={handleImageUpload} />
      </div>
      {/** Drawing on Image */}
      <div>
        <h2>Draw on Image</h2>
        <KonvaDrawer
          backgroundImageUrl={imageSrc}
          onSave={(result) => setDrawing(result)}
        />
      </div>
    </div>
  );
};

export default ImageEditor;
