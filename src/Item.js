import React, { forwardRef } from "react";
import "./Item.css";

const ItemWithRef = ({ id }, ref) => (
  <img ref={ref} src={`https://picsum.photos/id/${250 + id}/500`} />
);
export const Item = forwardRef(ItemWithRef);
