import React, { useEffect, useMemo, useState } from "react";
import BreedCard from "../components/BreedCard";
import { getBreeds } from "../api";
import "./BreedsPage.css";

export default function BreedsPage() {
  const [breeds, setBreeds] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    getBreeds()
      .then((res) => setBreeds(res.data.breeds))
      .catch((err) => console.error("❌ Error fetching breeds:", err));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? breeds.filter((b) => b.toLowerCase().includes(s)) : breeds;
  }, [breeds, q]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [q]); // reset page on new search

  return (
    <div className="breeds-page">
      {/* Search */}
      <div className="breeds-toolbar">
        <input
          className="search-input"
          placeholder="Search breeds…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="count">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="breeds-grid">
        {pageItems.map((breed) => (
          <BreedCard key={breed} breed={breed} />
        ))}
        {pageItems.length === 0 && (
          <div className="empty">No breeds found.</div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="pagination">
          <button
            className="btn ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} / {maxPage}
          </span>
          <button
            className="btn primary"
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
