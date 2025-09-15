import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import BreedGallery from "../components/BreedGallery";


export default function ChosenBreedPage() {
  const { breed } = useParams();
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch breed description from backend (later we’ll update backend to support this)
    API.get(`/breeds/${breed}/description`)
      .then((res) => setDescription(res.data.description))
      .catch(() => setDescription("No description yet."));
  }, [breed]);

  const saveDescription = () => {
    API.post(`/breeds/${breed}/description`, { description })
      .then(() => setEditMode(false));
  };

  return (
    <div className="chosen-breed-container">
      <h2>{breed}</h2>

      <div className="description-section">
        {editMode ? (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={saveDescription}>Save</button>
          </>
        ) : (
          <>
            <p>{description}</p>
            <button onClick={() => setEditMode(true)}>Edit</button>
          </>
        )}
      </div>

      <BreedGallery breed={breed} />
    </div>
  );
}
