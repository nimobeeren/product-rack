import React, { useRef, useEffect, useReducer } from "react";
import { Item } from "./Item";

export function Rack({ numItems }) {
  const initialState = {
    currentPage: 1,
    totalPages: 1,
    pageWidth: 0,
    emptySpace: 0
  };

  const containerRef = useRef();
  const itemWrapperRef = useRef();

  const [state, dispatch] = useReducer((prevState, action) => {
    const container = containerRef.current;
    const itemWrapper = itemWrapperRef.current;

    if (!container || !itemWrapper) {
      // Can't do calculations when we don't have these elements
      return prevState;
    }

    // Assumptions:
    // - Items have equal width
    // - Items are positioned in a CSS grid row
    // - Items are spaced using `column-gap`

    switch (action.type) {
      case "init":
      case "scroll":
      case "resize":
        const containerStyle = window.getComputedStyle(container);
        const itemWrapperStyle = window.getComputedStyle(itemWrapper);
        const gapWidth = parseFloat(containerStyle.columnGap) || 0;
        const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
        const itemWidth = parseFloat(itemWrapperStyle.width) || 0;
        const containerBorderBoxWidth = container.getBoundingClientRect().width;

        // Width of the container (not including padding)
        const containerWidth =
          containerBorderBoxWidth - paddingLeft - paddingRight;
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
        const currentPageNew =
          Math.floor(container.scrollLeft / pageWidthNew) + 1;
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
          emptySpace: emptySpaceNew
        });

        return {
          currentPage: currentPageNew,
          totalPages: totalPagesNew,
          pageWidth: pageWidthNew,
          emptySpace: emptySpaceNew
        };
      default:
        throw new Error();
    }
  }, initialState);

  // TODO: track scroll target (optimistic scrolling)
  const scrollToPage = page => {
    const container = containerRef.current;
    container.scrollTo({
      left: (page - 1) * state.pageWidth,
      behavior: "smooth"
    });
  };

  // These are all the triggers for updating
  // @ts-ignore
  useEffect(() => dispatch({ type: "init" }), [numItems]);
  // @ts-ignore
  const handleScroll = () => dispatch({ type: "scroll" }); // TODO: use requestAnimationFrame for performance
  // @ts-ignore
  window.onresize = () => dispatch({ type: "resize" }); // TODO: probably for this one too

  const { emptySpace, currentPage, totalPages } = state;

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
}
