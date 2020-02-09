import React, { useState, useRef, useEffect } from "react";
import { Item } from "./Item";

export const Rack = ({ numItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [emptySpace, setEmptySpace] = useState(0);

  const containerRef = useRef();
  const itemWrapperRef = useRef();

  // Assumptions:
  // - Items have equal width
  // - Items are positioned in a CSS grid row
  // - Items are spaced using `column-gap`

  // TODO: performance, split in scroll update (pagination only) and full update (or useReducer?)
  const update = () => {
    const container = containerRef.current;
    const itemWrapper = itemWrapperRef.current;

    if (!container || !itemWrapper) {
      // Can't do calculations when we don't have the elements
      return;
    }

    const containerStyle = window.getComputedStyle(container);
    const itemWrapperStyle = window.getComputedStyle(itemWrapper);
    const gapWidth = parseFloat(containerStyle.columnGap) || 0;
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
    const itemWidth = parseFloat(itemWrapperStyle.width) || 0;
    const containerBorderBoxWidth = container.getBoundingClientRect().width;

    // Width of the container (not including padding)
    const containerWidth = containerBorderBoxWidth - paddingLeft - paddingRight;
    // Distance between the left edge of the first item and the right edge of
    // the last item
    const totalItemsWidth = numItems * (itemWidth + gapWidth);
    // How many items (with gaps) fit completely inside the container
    const maxItemsPerPage = Math.max(
      Math.floor((containerWidth + gapWidth) / (itemWidth + gapWidth)),
      1
    );
    // Combined width of items (with gaps) on a fully filled page
    const pageWidthNew = maxItemsPerPage * (itemWidth + gapWidth);
    // Total number of pages
    const totalPagesNew = Math.ceil(numItems / maxItemsPerPage);
    // Current page
    const currentPageNew = Math.floor(container.scrollLeft / pageWidthNew) + 1;
    // Number of additional items (call them placeholders) needed to fill up
    // the last page
    const numPlaceholders = totalPagesNew * maxItemsPerPage - numItems;
    // Combined width of placeholders (with gaps)
    const placeHoldersWidth = numPlaceholders * (itemWidth + gapWidth);
    // Distance between the left edge of the next item that doesn't fit in the
    // container, and the right edge of the container
    // In other words: how much of the next item is inside the container
    const partialItemWidth =
      containerWidth - maxItemsPerPage * (itemWidth + gapWidth);
    // The amount of empty space between the right edge of the last item and
    // the right edge of the screen
    const emptySpaceNew =
      placeHoldersWidth + gapWidth + partialItemWidth + paddingRight;

    console.log({
      containerWidth,
      pageWidth: pageWidthNew,
      totalItemsWidth,
      numPlaceholders,
      partialItemWidth,
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

  // These are all the triggers for updating
  useEffect(update, [numItems]);
  const handleScroll = update; // TODO: use requestAnimationFrame for performance
  window.onresize = update; // TODO: probably for this one too

  // TODO: a11y
  return (
    <div>
      <div className="container" ref={containerRef} onScroll={handleScroll}>
        {[...Array(numItems).keys()].map(item => (
          <div
            className="item-wrapper"
            ref={item === 0 ? itemWrapperRef : undefined}
            key={item}
            style={
              item === numItems - 1 ? { paddingRight: emptySpace } : undefined
            }
          >
            <Item id={item} />
          </div>
        ))}
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
