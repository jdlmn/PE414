import { useEffect, useState, useCallback } from "react";
import { getDogFact } from "../api";
import "./DogCard.css";

export default function DogCard() {
  const [dogData, setDogData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFact = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDogFact();
      setDogData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFact(); // initial load
  }, [fetchFact]);

  if (!dogData) return null;

  return (
    <div className="dog-card">
      <img src={dogData.image} alt="Random dog" />
      <p>{dogData.fact}</p>

      <button className="btn primary" onClick={fetchFact} disabled={loading}>
        {loading ? "Loading..." : "Generate new fact"}
      </button>
    </div>
  );
}
