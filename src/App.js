import React, { useState } from "react";
import { Rack } from "./Rack";

export const App = () => {
  const [items, setItems] = useState(4);
  const add = () => setItems(items + 1);
  const remove = () => setItems(items - 1);
  return (
    <>
      <Rack items={items} />
      <button onClick={add}>+</button>
      <button onClick={remove}>-</button>
    </>
  );
};
