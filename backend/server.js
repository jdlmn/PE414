import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); // <-- important for PUT body

// Small JSON "store"
const DATA_DIR = path.join(__dirname, "data");
const DESCRIPTIONS_PATH = path.join(DATA_DIR, "descriptions.json");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DESCRIPTIONS_PATH)) fs.writeFileSync(DESCRIPTIONS_PATH, JSON.stringify({}), "utf-8");

function readDescriptions() {
  try {
    const raw = fs.readFileSync(DESCRIPTIONS_PATH, "utf-8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}
function writeDescriptions(obj) {
  fs.writeFileSync(DESCRIPTIONS_PATH, JSON.stringify(obj, null, 2), "utf-8");
}

// 1) Random fact + random image
app.get("/dogfact", async (req, res) => {
  try {
    const factRes = await fetch("https://dogapi.dog/api/v2/facts");
    const factData = await factRes.json();
    const fact = factData?.data?.[0]?.attributes?.body || "Dogs are awesome!";

    const imgRes = await fetch("https://dog.ceo/api/breeds/image/random");
    const imgData = await imgRes.json();
    const image = imgData?.message;

    res.json({ fact, image });
  } catch (err) {
    console.error("Error /dogfact:", err);
    res.status(500).json({ error: "Failed to fetch dog fact/image" });
  }
});

// 2) Breeds list
app.get("/breeds", async (req, res) => {
  try {
    const r = await fetch("https://dog.ceo/api/breeds/list/all");
    const j = await r.json();
    const list = Object.keys(j?.message || {});
    res.json({ breeds: list });
  } catch (err) {
    console.error("Error /breeds:", err);
    res.status(500).json({ error: "Failed to fetch breeds" });
  }
});

// 3) Images for a breed
app.get("/breeds/:breed", async (req, res) => {
  const { breed } = req.params;
  try {
    const r = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/12`);
    const j = await r.json();
    res.json({ images: j?.message || [] });
  } catch (err) {
    console.error("Error /breeds/:breed:", err);
    res.status(500).json({ error: "Failed to fetch breed images" });
  }
});

// 4) Description GET
app.get("/breeds/:breed/description", (req, res) => {
  const { breed } = req.params;
  const store = readDescriptions();
  res.json({ description: store[breed] || "" });
});

// 5) Description PUT (save)
app.put("/breeds/:breed/description", (req, res) => {
  const { breed } = req.params;
  const { description } = req.body;
  if (typeof description !== "string") {
    return res.status(400).json({ error: "description must be a string" });
  }
  const store = readDescriptions();
  store[breed] = description.trim();
  writeDescriptions(store);
  res.json({ ok: true, description: store[breed] });
});

// Root
app.get("/", (_req, res) => res.send("Welcome to Dog API backend 🐶"));

// Start
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
