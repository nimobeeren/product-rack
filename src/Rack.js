import React, { useState } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // TODO: update on resize
  const handleScroll = event => {
    const container = event.currentTarget;

    const pageWidth = container.getBoundingClientRect().width;
    const totalWidth = container.scrollWidth;
    console.log({ pageWidth, totalWidth });
    const scrollPosNew = container.scrollLeft;
    const currentPageNew = Math.floor(scrollPosNew / pageWidth) + 1;
    const totalPagesNew = Math.ceil(totalWidth / pageWidth); // FIXME

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
