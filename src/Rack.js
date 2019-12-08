import React, { useState, useRef, useEffect } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numPlaceholders, setNumPlaceholders] = useState(0);

  const containerRef = useRef();

  const update = () => {
    const container = containerRef.current;

    const viewWidth = container.getBoundingClientRect().width;
    const totalWidth = container.scrollWidth;
    const gapWidth = parseFloat(window.getComputedStyle(container).columnGap);
    const itemWidth = (totalWidth + gapWidth) / (items + numPlaceholders);
    const itemsPerPage = Math.floor((viewWidth + gapWidth) / itemWidth);
    const pageWidth = itemsPerPage * itemWidth;
    const totalPagesNew = Math.ceil(items / itemsPerPage);

    console.log({ viewWidth, totalWidth, itemWidth, itemsPerPage });

    setCurrentPage(Math.floor(container.scrollLeft / pageWidth) + 1);
    setTotalPages(totalPagesNew);
    setNumPlaceholders(totalPagesNew * itemsPerPage - items);
  };

  // these are all the triggers for updating
  useEffect(update);
  const handleScroll = update;
  window.onresize = update;

  return (
    <>
      <div className="rack" ref={containerRef} onScroll={handleScroll}>
        {[...Array(items).keys()].map(item => (
          <Item key={item} id={item} />
        ))}
        {[...Array(numPlaceholders).keys()].map(item => (
          <Item key={`placeholder${item}`} placeholder />
        ))}
      </div>
      <div>
        <pre>currentPage: {currentPage}</pre>
        <pre>totalPages: {totalPages}</pre>
        <pre>numPlaceholders: {numPlaceholders}</pre>
      </div>
    </>
  );
};
