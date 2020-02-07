import React from "react";

export const Item = ({ id = 0 }) => (
  <img className="item" src={`https://picsum.photos/id/${230 + id}/500`} />
);
