import { useEffect, useState } from "react";
import API from "../api";
import "./DogCard.css";

export default function DogCard() {
  const [dogData, setDogData] = useState(null);

  useEffect(() => {
    API.get("/dogfact").then((res) => setDogData(res.data));
  }, []);

  if (!dogData) return null;

  return (
    <div className="dog-card">
      <img src={dogData.image} alt="Random dog" />
      <p>{dogData.fact}</p>
    </div>
  );
}
