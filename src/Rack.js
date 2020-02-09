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

  // TODO: performance, split in scroll update (pagination only) and full update (or useReducer?)
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

    // Distance between the left edge of the first item and the right edge of
    // the screen
    const viewWidth = container.getBoundingClientRect().width - paddingWidth;
    // Distance between the left edge of the first item and the right edge of
    // the last item
    const totalItemsWidth = items * (itemWidth + gapWidth);
    // How many items (with gaps) fit completely inside `viewWidth`
    const itemsPerPage = Math.max(
      Math.floor((viewWidth + gapWidth) / (itemWidth + gapWidth)),
      1
    );
    const pageWidthNew = itemsPerPage * (itemWidth + gapWidth);
    const totalPagesNew = Math.ceil(items / itemsPerPage);
    const currentPageNew = Math.floor(container.scrollLeft / pageWidthNew) + 1;
    const numPlaceholders = totalPagesNew * itemsPerPage - items;
    const placeHoldersWidth = numPlaceholders * (itemWidth + gapWidth);
    const partialItemWidth = viewWidth - itemsPerPage * (itemWidth + gapWidth);
    const emptySpaceNew = placeHoldersWidth + gapWidth + partialItemWidth;

    console.log({
      viewWidth,
      pageWidth: pageWidthNew,
      totalItemsWidth,
      numPlaceholders,
      emptySpace: emptySpaceNew
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
  useEffect(update, [items]);
  const handleScroll = update; // TODO: use requestAnimationFrame for performance
  window.onresize = update; // TODO: probably for this one too

  // TODO: a11y
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
          {/* TODO: prefer not to create useless div */}
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
