import React, { useState } from "react";
import { Rack } from "./Rack";

export const App = () => {
  const [items, setItems] = useState(8);
  const add = () => setItems(items + 1);
  const remove = () => setItems(items - 1);
  return (
    <main>
      <Rack items={items} />
      <div className="controls">
        <button onClick={remove}>-</button>
        <span>{items}</span>
        <button onClick={add}>+</button>
      </div>
    </main>
  );
};
