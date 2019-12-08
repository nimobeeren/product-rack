import React, { useState, useRef, useEffect } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [numPlaceholders, setNumPlaceholders] = useState(0);

  const containerRef = useRef();

  const update = () => {
    const container = containerRef.current;

    const viewWidth = container.getBoundingClientRect().width;
    const totalWidth = container.scrollWidth;
    const gapWidth =
      parseFloat(window.getComputedStyle(container).columnGap) || 0;
    const itemWidth = (totalWidth + gapWidth) / (items + numPlaceholders);
    const itemsPerPage = Math.floor((viewWidth + gapWidth) / itemWidth);
    const pageWidthNew = itemsPerPage * itemWidth;
    const totalPagesNew = Math.ceil(items / itemsPerPage);
    console.log({ itemsPerPage });

    setCurrentPage(Math.floor(container.scrollLeft / pageWidthNew) + 1);
    setTotalPages(totalPagesNew);
    setPageWidth(pageWidthNew);
    setNumPlaceholders(totalPagesNew * itemsPerPage - items);
  };

  // TODO: track scroll target
  const scrollToPage = page => {
    const container = containerRef.current;
    container.scrollTo({
      left: (page - 1) * pageWidth,
      behavior: "smooth"
    });
  };

  // these are all the triggers for updating
  useEffect(update);
  const handleScroll = update;
  window.onresize = update;

  return (
    <>
      <div className="wrapper">
        <div className="rack" ref={containerRef} onScroll={handleScroll}>
          {[...Array(items + numPlaceholders).keys()].map(item => (
            <div className="item-wrapper" key={item}>
              <Item id={item} placeholder={item >= items} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={() => scrollToPage(currentPage - 1)}>Prev</button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => scrollToPage(currentPage + 1)}>Next</button>
      </div>
    </>
  );
};
