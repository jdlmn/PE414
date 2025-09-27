import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function BreedCard({ breed }) {
  const [image, setImage] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        try {
          const res = await fetch(`http://localhost:5000/breeds/${breed}`);
          const data = await res.json();
          setImage(data.images[0]);
        } catch (err) {
          console.error(err);
        } finally {
          observer.disconnect();
        }
      }
    });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [breed]);

  return (
    <Link to={`/breeds/${breed}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        ref={cardRef}
        style={{
          background: "#fff",
          padding: "12px",
          borderRadius: "14px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          transition: "transform .1s ease",
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
              borderRadius: "10px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "150px",
              background: "#e2e8f0",
              borderRadius: "10px",
            }}
          />
        )}
        <h3 style={{ marginTop: "0.6rem", textTransform: "capitalize" }}>{breed}</h3>
      </div>
    </Link>
  );
}
