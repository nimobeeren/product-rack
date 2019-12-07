import React, { useRef } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const ref = useRef();
  const handleScroll = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <div className="rack">
        {[...Array(items).keys()].map(item => (
          <Item key={item} id={item} ref={item === 5 ? ref : undefined} />
        ))}
      </div>
      <button onClick={handleScroll}>Scroll</button>
    </>
  );
};
