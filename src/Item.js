import React, { forwardRef } from "react";
import "./Item.css";

export const Item = forwardRef(({ id }, ref) => (
  <img ref={ref} src={`https://picsum.photos/id/${250 + id}/500`} />
));
