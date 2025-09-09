import { useState, useEffect } from "react";
import API from "./api";
import Navbar from "./components/Navbar";
import DogCard from "./components/DogCard";
import BreedGallery from "./components/BreedGallery";
import "./App.css";

export default function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");

  useEffect(() => {
    API.get("/breeds").then((res) => setBreeds(res.data.breeds));
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      {/* ✅ Always show random dog fact + image */}
      <DogCard />

      {/* Breed selector */}
      <div className="breed-selector">
        <label htmlFor="breed">Choose a breed:</label>
        <select
          id="breed"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">-- Select a breed --</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ If no breed chosen, nothing else shows */}
      {selectedBreed && <BreedGallery breed={selectedBreed} />}
    </div>
  );
}
