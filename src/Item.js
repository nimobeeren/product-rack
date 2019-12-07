import React, { forwardRef } from "react";

export const Item = forwardRef(({ id = 0 }, ref) => (
  <img ref={ref} src={`https://picsum.photos/id/${250 + id}/500`} />
));
