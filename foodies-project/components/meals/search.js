"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./search.module.css";

export default function Search({ defaultQuery = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function handleSearch() {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    router.push(`/meals?${params.toString()}`);
  }

  return (
    <div className={classes.searchContainer}>
      <input
        type="text"
        value={query}
        placeholder="Search meals..."
        className={classes.searchInput}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button className={classes.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
