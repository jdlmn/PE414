import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreedCard from "../components/BreedCard";

export default function BreedsPage() {
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/breeds")
      .then((res) => res.json())
      .then((data) => setBreeds(data.breeds))
      .catch((err) => console.error("❌ Error fetching breeds:", err));
  }, []);

  return (
    <div
      className="breeds-container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      {breeds.map((breed) => (
        <BreedCard key={breed} breed={breed} />
      ))}
    </div>
  );
}
