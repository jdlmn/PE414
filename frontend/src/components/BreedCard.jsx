import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function BreedCard({ breed }) {
  const [image, setImage] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          try {
            const res = await fetch(`http://localhost:5000/breeds/${breed}`);
            const data = await res.json();
            setImage(data.images[0]);
          } catch (err) {
            console.error(`❌ Error fetching image for ${breed}`, err);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [breed]);

  return (
    <Link to={`/breeds/${breed}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        ref={cardRef}
        className="breed-card"
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          background: "#fff",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={breed}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "150px",
              background: "#e2e8f0",
              borderRadius: "6px",
            }}
          />
        )}
        <h3 style={{ marginTop: "0.5rem", textTransform: "capitalize" }}>{breed}</h3>
      </div>
    </Link>
  );
}
