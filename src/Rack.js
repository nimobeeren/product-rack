import React, { useState } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // TODO: update on load
  // TODO: update on resize
  const handleScroll = event => {
    const container = event.currentTarget;

    const viewWidth = container.getBoundingClientRect().width;
    const totalWidth = container.scrollWidth;
    const itemWidth = totalWidth / items;
    const visibleItems = Math.floor(viewWidth / itemWidth); // FIXME not quite perfect
    const pageWidth = visibleItems * itemWidth;
    console.log({ pageWidth: viewWidth, totalWidth, itemWidth, visibleItems });
    const scrollPosNew = container.scrollLeft;
    const currentPageNew = Math.floor(scrollPosNew / pageWidth) + 1;
    const totalPagesNew = items / visibleItems;

    setScrollPos(scrollPosNew);
    setCurrentPage(currentPageNew);
    setTotalPages(totalPagesNew);
  };

  return (
    <>
      <div className="rack" onScroll={handleScroll}>
        {[...Array(items).keys()].map(item => (
          <Item key={item} id={item} />
        ))}
      </div>
      <div>
        <pre>scrollPos: {scrollPos}</pre>
        <pre>currentPage: {currentPage}</pre>
        <pre>totalPages: {totalPages}</pre>
      </div>
    </>
  );
};
