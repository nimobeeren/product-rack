import React, { useRef, useEffect, useReducer } from "react";
import { Item } from "./Item";

// Assumptions:
// - Items have equal width
// - Items are positioned in a CSS grid row
// - Items are spaced using `column-gap`

function calculatePagination(numItems, maxItemsPerPage, scrollPos, pageWidth) {
  return {
    totalPages: Math.ceil(numItems / maxItemsPerPage),
    currentPage: Math.floor(scrollPos / pageWidth) + 1
  };
}

export function Rack({ numItems }) {
  const initialState = {
    maxItemsPerPage: 0,
    currentPage: 1,
    totalPages: 1,
    pageWidth: 0,
    emptySpace: 0
  };

  const containerRef = useRef();
  const itemWrapperRef = useRef();

  const [state, dispatch] = useReducer((prevState, action) => {
    console.log("reduced called with type", action.type);
    let container, scrollPos;
    switch (action.type) {
      case "scroll":
        // Get needed elements from refs
        container = containerRef.current;
        if (!container) {
          return prevState;
        }

        // Get all the things we need from the DOM
        scrollPos = container.scrollLeft;

        return {
          ...prevState,
          ...calculatePagination(
            numItems,
            prevState.maxItemsPerPage,
            scrollPos,
            prevState.pageWidth
          )
        };
      case "init":
      case "resize":
        // Get needed elements from refs
        container = containerRef.current;
        const itemWrapper = itemWrapperRef.current;
        if (!container || !itemWrapper) {
          return;
        }

        // Get all the things we need from the DOM
        scrollPos = container.scrollLeft;
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
        // How many items (with gaps) fit completely inside the container
        const maxItemsPerPage = Math.max(
          Math.floor((containerWidth + gapWidth) / (itemWidth + gapWidth)),
          1
        );
        // Combined width of items (with gaps) on a fully filled page
        const pageWidth = maxItemsPerPage * (itemWidth + gapWidth);
        // Pagination
        const { totalPages, currentPage } = calculatePagination(
          numItems,
          maxItemsPerPage,
          scrollPos,
          pageWidth
        );
        // Number of additional items (call them placeholders) needed to fill up
        // the last page
        const numPlaceholders = totalPages * maxItemsPerPage - numItems;
        // Combined width of placeholders (with gaps)
        const placeHoldersWidth = numPlaceholders * (itemWidth + gapWidth);
        // Distance between the left edge of the next item that doesn't fit in
        // the container, and the right edge of the container
        // In other words: how much of the next item is inside the container
        const partialItemWidth =
          containerWidth - maxItemsPerPage * (itemWidth + gapWidth);
        // The amount of empty space between the right edge of the last item and
        // the right edge of the screen
        const emptySpace =
          placeHoldersWidth + gapWidth + partialItemWidth + paddingRight;

        // console.log({
        //   maxItemsPerPage,
        //   currentPage,
        //   totalPages,
        //   pageWidth,
        //   emptySpace
        // });

        return {
          maxItemsPerPage,
          currentPage,
          totalPages,
          pageWidth,
          emptySpace
        };
      default:
        throw new Error("Action type not supported");
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
  useEffect(() => dispatch({ type: "init" }), [numItems]);
  // TODO: use requestAnimationFrame for performance
  const handleScroll = () => dispatch({ type: "scroll" });
  // TODO: probably for this one too
  // FIXME: this one is never actually dispatching the action for some reason
  window.onresize = () => dispatch({ type: "resize" });

  const { emptySpace, currentPage, totalPages } = state;

  // TODO: a11y
  return (
    <div className="temp">
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
