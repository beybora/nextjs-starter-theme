"use client";

import React, { useEffect, useState } from "react";
import Results from "./Results/Results";
import Pagination from "./Pagination/Pagination";
import { useRouter, usePathname } from "next/navigation";
import queryString from "query-string";
import Filters from "./Filters/Filters";

const PropertySearch = () => {
  const [properties, setProperties] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 3;
  const router = useRouter();
  const pathname = usePathname();
  const search = async () => {
    const { page, petFriendly, parking, minPrice, maxPrice } =
      queryString.parse(window.location.search);
    const filters = {};
    if (minPrice) {
      filters.minPrice = parseInt(minPrice);
    }
    if (maxPrice) {
      filters.maxPrice = parseInt(maxPrice);
    }
    if (petFriendly === "true") {
      filters.petFriendly = true;
    }
    if (parking === "true") {
      filters.parking = true;
    }

    const response = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({
        page: parseInt(page) || 1,
        ...filters,
      }),
    });

    const data = await response.json();
    setProperties(data.properties);
    setTotalResults(data.total);
  };

  const handlePageClick = async (pageNumber) => {
    const { petFriendly, parking, minPrice, maxPrice } =
      queryString.parse(window.location.search);

     router.push(
      `${pathname}?page=${pageNumber}&petFriendly=${petFriendly}&parking=${parking}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
    );
    search();
  };

  const handleSearch = async (petFriendly, parking, minPrice, maxPrice) => {
     router.push(
      `${pathname}?page=1&petFriendly=${petFriendly}&parking=${parking}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
    );
    search();
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      <Filters onSearch={handleSearch} />
      <Results properties={properties} />
      <Pagination
        onPageClick={handlePageClick}
        totalPages={Math.ceil(totalResults / pageSize)}
      />
    </div>
  );
};

export default PropertySearch;
