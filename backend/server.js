import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Route 1: Random fact + random image
app.get("/dogfact", async (req, res) => {
  try {
    const factResponse = await fetch("https://dogapi.dog/api/v2/facts");
    const factData = await factResponse.json();
    const fact = factData.data[0]?.attributes?.body || "Dogs are awesome!";

    const imageResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    const imageData = await imageResponse.json();
    const image = imageData.message;

    res.json({ fact, image });
  } catch (err) {
    console.error("❌ Error fetching dog data:", err);
    res.status(500).json({ error: "Failed to fetch dog data" });
  }
});

// ✅ Route 2: Get all breeds
app.get("/breeds", async (req, res) => {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    const breeds = Object.keys(data.message);
    res.json({ breeds });
  } catch (err) {
    console.error("❌ Error fetching breeds:", err);
    res.status(500).json({ error: "Failed to fetch breeds" });
  }
});

// ✅ Route 3: Get images for chosen breed
app.get("/breeds/:breed", async (req, res) => {
  const { breed } = req.params;
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/6`);
    const data = await response.json();
    res.json({ breed, images: data.message });
  } catch (err) {
    console.error("❌ Error fetching breed images:", err);
    res.status(500).json({ error: "Failed to fetch breed images" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Dog API backend 🐶");
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
