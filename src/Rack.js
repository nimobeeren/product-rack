import React, { useState, useRef, useEffect } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [emptySpace, setEmptySpace] = useState(0);

  const containerRef = useRef();
  const itemWrapperRef = useRef();

  // TODO: list of assumptions

  const update = () => {
    const container = containerRef.current;
    const itemWrapper = itemWrapperRef.current;

    if (!container || !itemWrapper) {
      // can't do calculations when we dont have the elements
      return;
    }

    const containerStyle = window.getComputedStyle(container);
    const itemWrapperStyle = window.getComputedStyle(itemWrapper);
    const gapWidth = parseFloat(containerStyle.columnGap) || 0;
    const paddingWidth = parseFloat(containerStyle.paddingLeft) || 0;
    const itemWidth = parseFloat(itemWrapperStyle.width);

    const viewWidth = container.getBoundingClientRect().width - paddingWidth;
    const totalWidth = container.scrollWidth - paddingWidth;
    const itemsPerPage = Math.floor(
      (viewWidth + gapWidth) / (itemWidth + gapWidth)
    );
    const pageWidthNew = itemsPerPage * (itemWidth + gapWidth);
    const totalPagesNew = Math.ceil(items / itemsPerPage);
    const currentPageNew = Math.floor(container.scrollLeft / pageWidthNew) + 1;
    const numPlaceholders = totalPagesNew * itemsPerPage - items;
    const placeHoldersWidth = numPlaceholders * (itemWidth + gapWidth);
    const partialItemWidth = viewWidth - itemsPerPage * (itemWidth + gapWidth);
    const emptySpaceNew = placeHoldersWidth + partialItemWidth;
    // FIXME: empty space becomes negative when no item is partially visible,
    // which makes it impossible to reach the last page
    // FIXME: handle case where < 1 item is fully visible
    // TODO: performance, split in scroll update (pagination only) and full update

    console.log({
      itemsPerPage,
      numPlaceholders,
      itemWidth,
      viewWidth,
      totalWidth,
      scrollLeft: container.scrollLeft,
      gapWidth,
      emptySpaceNew
    });

    setCurrentPage(currentPageNew);
    setTotalPages(totalPagesNew);
    setPageWidth(pageWidthNew);
    setEmptySpace(emptySpaceNew);
  };

  // TODO: track scroll target (optimistic scrolling)
  const scrollToPage = page => {
    const container = containerRef.current;
    container.scrollTo({
      left: (page - 1) * pageWidth,
      behavior: "smooth"
    });
  };

  // these are all the triggers for updating
  useEffect(update, []);
  const handleScroll = update;
  window.onresize = update;

  return (
    <div>
      <div className="wrapper">
        <div className="container" ref={containerRef} onScroll={handleScroll}>
          {[...Array(items).keys()].map(item => (
            <div
              className="item-wrapper"
              ref={item === 0 ? itemWrapperRef : undefined}
              key={item}
            >
              <Item id={item} />
            </div>
          ))}
          <div className="empty-space" style={{ width: emptySpace }} />
        </div>
      </div>
      <div className="pagination">
        <button onClick={() => scrollToPage(currentPage - 1)}>Prev</button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => scrollToPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};
