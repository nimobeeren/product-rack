import React, { useRef } from "react";
import { Item } from "./Item";
import "./Rack.css";

export const Rack = ({ items }) => {
  const ref = useRef();
  const handleScroll = () => {
    ref.current.scroll({ left: 800, top: 0, behaviour: "smooth" });
  };
  return (
    <>
      <div className="rack" ref={ref}>
        {[...Array(items).keys()].map(item => (
          <Item key={item} id={item} />
        ))}
      </div>
      <button onClick={handleScroll}>Scroll</button>
    </>
  );
};
