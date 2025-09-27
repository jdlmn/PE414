import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function ChosenBreedPage() {
  const { breed } = useParams();
  const breedKey = decodeURIComponent(breed || "");

  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [descRes, imgsRes] = await Promise.all([
        API.get(`/breeds/${breedKey}/description`),
        API.get(`/breeds/${breedKey}`),
      ]);
      setDescription(descRes?.data?.description ?? "");
      setImages(imgsRes?.data?.images ?? []);
    } catch (e) {
      console.error("Failed to load breed data:", e);
    } finally {
      setLoading(false);
    }
  }, [breedKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Show up to 12 images (adjust as you wish)
  const shownImages = useMemo(() => (images || []).slice(0, 12), [images]);

  const save = async () => {
    try {
      setSaving(true);
      const trimmed = (description || "").trim();
      await API.put(`/breeds/${breedKey}/description`, { description: trimmed });
      setDescription(trimmed);
      setEditMode(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save description.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{breedKey}</h1>

      {/* Description */}
      <div style={styles.card}>
        <h2 style={styles.h2}>Description</h2>

        {editMode ? (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Write something about this breed…"
              style={styles.textarea}
            />
            <div style={styles.actions}>
              <button
                onClick={() => setEditMode(false)}
                style={{ ...styles.btn, ...styles.ghostBtn }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={save}
                style={{ ...styles.btn, ...styles.primaryBtn }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={styles.descText}>
              {loading
                ? "Loading..."
                : description?.trim()
                ? description
                : "No description yet. Click Edit to add one."}
            </p>
            <button
              onClick={() => setEditMode(true)}
              style={{ ...styles.btn, ...styles.primaryBtn }}
            >
              Edit
            </button>
          </>
        )}
      </div>

      {/* Centered, responsive gallery (any number of images) */}
      <div style={styles.galleryFlex}>
        {shownImages.map((src, i) => (
          <img key={i} src={src} alt={`${breedKey}-${i}`} style={styles.img} />
        ))}
        {!loading && shownImages.length === 0 && (
          <div style={styles.empty}>No images available.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  title: {
    textTransform: "capitalize",
    fontSize: "2rem",
    margin: "0 0 6px",
  },
  h2: { margin: "0 0 8px" },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    maxWidth: 900,
  },
  descText: {
    color: "#111827",
    marginBottom: 10,
    minHeight: 24,
    whiteSpace: "pre-wrap",
  },
  textarea: {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    font: "inherit",
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  primaryBtn: {
    color: "#fff",
    background:
      "linear-gradient(90deg, rgb(37,99,235), rgb(30,64,175))",
  },
  ghostBtn: {
    background: "#f3f4f6",
    color: "#111827",
  },
  // FLEX gallery centers any number of images
  galleryFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  img: {
    // Responsive width: fits small screens without overflow
    width: "min(280px, 95vw)",
    aspectRatio: "4 / 3",
    objectFit: "cover",
    borderRadius: 12,
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    padding: 16,
  },
};
