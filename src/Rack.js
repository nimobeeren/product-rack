import React, { useState, useRef, useEffect } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [numPlaceholders, setNumPlaceholders] = useState(0);

  const containerRef = useRef();
  const itemWrapperRef = useRef();

  const update = () => {
    const container = containerRef.current;
    const itemWrapper = itemWrapperRef.current;

    const gapWidth =
      parseFloat(window.getComputedStyle(container).columnGap) || 0;
    const paddingWidth =
      parseFloat(window.getComputedStyle(itemWrapper).paddingLeft) || 0;

    const viewWidth = container.getBoundingClientRect().width - paddingWidth;
    const totalWidth = container.scrollWidth - paddingWidth - gapWidth;
    const itemWidth = (totalWidth + gapWidth) / (items + numPlaceholders);
    const itemsPerPage = Math.floor((viewWidth + gapWidth) / itemWidth);
    const pageWidthNew = itemsPerPage * itemWidth;
    const totalPagesNew = Math.ceil(items / itemsPerPage);
    const currentPageNew = Math.floor(container.scrollLeft / pageWidthNew) + 1;
    const numPlaceholdersNew = totalPagesNew * itemsPerPage - items;

    console.log({
      itemsPerPage,
      numPlaceholdersNew,
      itemWidth,
      viewWidth,
      totalWidth
    });

    setCurrentPage(currentPageNew);
    setTotalPages(totalPagesNew);
    setPageWidth(pageWidthNew);
    setNumPlaceholders(numPlaceholdersNew);
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
        <div className="container" ref={containerRef} onScroll={handleScroll}>
          {[...Array(items + numPlaceholders).keys()].map(item => (
            <div
              className="item-wrapper"
              ref={item === 0 ? itemWrapperRef : undefined}
              key={item}
            >
              <Item id={item} placeholder={item >= items} />
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <button onClick={() => scrollToPage(currentPage - 1)}>Prev</button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => scrollToPage(currentPage + 1)}>Next</button>
      </div>
    </>
  );
};
