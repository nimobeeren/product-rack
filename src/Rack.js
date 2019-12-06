import React, { useRef } from "react";
import { Item } from "./Item";
import "./Rack.css";

export const Rack = ({ items }) => {
  const ref = useRef();
  const handleScroll = () => {
    ref.current.scrollIntoView({ behaviour: "smooth" });
  };
  return (
    <>
      <div className="rack">
        {[...Array(items).keys()].map(item => {
          return (
            <div
              key={item}
              ref={item === 5 ? ref : console.log(item) && undefined}
              style={{
                minWidth: 280,
                height: 280,
                margin: 16,
                background: "limegreen"
              }}
            />
            // <Item key={item} id={item} ref={item === 5 ? ref : undefined} />
          );
        })}
      </div>
      <button onClick={handleScroll}>Scroll</button>
    </>
  );
};
