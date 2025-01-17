import React from "react";
import { AiMouseIcon, DefaultMouseIcon, DragDropMouseIcon } from "./SvgIcons";

const ToolIcon = ({ iconType }) => {
  const icons = {
    default: <DefaultMouseIcon />,
    ai: <AiMouseIcon />,
    dragDrop: <DragDropMouseIcon />,
  };
  return icons[iconType] || <DefaultMouseIcon />;
};

export default ToolIcon;
