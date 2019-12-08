import React, { useState } from "react";
import { Rack } from "./Rack";

export const App = () => {
  const [items, setItems] = useState(8);
  const add = () => setItems(items + 1);
  const remove = () => setItems(items - 1);
  return (
    <>
      <Rack items={items} />
      <div>
        <span>
          <pre>items: {items}</pre>
        </span>
        <button onClick={add}>+</button>
        <button onClick={remove}>-</button>
      </div>
    </>
  );
};
