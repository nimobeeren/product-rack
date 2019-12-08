import React, { useState, useRef } from "react";
import { Item } from "./Item";

export const Rack = ({ items }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numPlaceholders, setNumPlaceholders] = useState(0);

  const realItemsRef = useRef();

  // TODO: update on load
  // TODO: update on resize
  const handleScroll = event => {
    const container = event.currentTarget;

    const viewWidth = container.getBoundingClientRect().width;
    const totalWidth = container.scrollWidth;
    const itemWidth = totalWidth / (items + numPlaceholders); // FIXME not quite accurate
    const itemsPerPage = Math.floor(viewWidth / itemWidth); // FIXME not quite accurate
    const pageWidth = itemsPerPage * itemWidth;
    console.log({ viewWidth, totalWidth, itemWidth, itemsPerPage });
    const scrollPosNew = container.scrollLeft;
    const currentPageNew = Math.floor(scrollPosNew / pageWidth) + 1;
    const totalPagesNew = Math.ceil(items / itemsPerPage);
    const numPlaceholdersNew = totalPagesNew * itemsPerPage - items;

    setScrollPos(scrollPosNew);
    setCurrentPage(currentPageNew);
    setTotalPages(totalPagesNew);
    setNumPlaceholders(numPlaceholdersNew);
  };

  return (
    <>
      <div className="rack" onScroll={handleScroll}>
        {[...Array(items).keys()].map(item => (
          <Item key={item} id={item} />
        ))}
        {[...Array(numPlaceholders).keys()].map(item => (
          <Item key={`placeholder${item}`} placeholder />
        ))}
      </div>
      <div>
        <pre>scrollPos: {scrollPos}</pre>
        <pre>currentPage: {currentPage}</pre>
        <pre>totalPages: {totalPages}</pre>
        <pre>numPlaceholders: {numPlaceholders}</pre>
      </div>
    </>
  );
};
