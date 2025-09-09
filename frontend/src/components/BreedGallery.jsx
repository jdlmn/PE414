import { useEffect, useState } from "react";
import API from "../api";
import "./BreedGallery.css";

export default function BreedGallery({ breed }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (breed) {
      API.get(`/breeds/${breed}`).then((res) => setImages(res.data.images));
    }
  }, [breed]);

  return (
    <div className="gallery-container">
      {images.map((img, idx) => (
        <img key={idx} src={img} alt={breed} />
      ))}
    </div>
  );
}
