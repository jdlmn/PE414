import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import * as descRepo from "./repos/descriptionsRepo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (_req, res) => res.send("Dog API backend with SQLite is up"));

//endpoints
app.get("/api/breeds", async (_req, res) => {
  try {
    const r = await fetch("https://dog.ceo/api/breeds/list/all");
    const j = await r.json();
    res.json(j);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Upstream error" });
  }
});

app.get("/api/breed/:breed/images", async (req, res) => {
  const { breed } = req.params;
  const count = Number(req.query.count || 12);
  try {
    const r = await fetch(
      `https://dog.ceo/api/breed/${encodeURIComponent(breed)}/images/random/${count}`
    );
    const j = await r.json();
    res.json(j);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Upstream error" });
  }
});

//repo based descr
app.get("/api/descriptions", (_req, res) => {
  const items = descRepo.listAll();
  res.json({ items });
});


app.get("/api/descriptions/:breed", (req, res) => {
  const { breed } = req.params;
  const row = descRepo.getOne(breed);
  if (!row) return res.json({ breed, description: null, updated_at: null });
  res.json({ breed, ...row });
});

// Create/Update (upsert)
app.put("/api/descriptions/:breed", (req, res) => {
  const { breed } = req.params;
  const { description } = req.body;

  if (typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ error: "description must be a non-empty string" });
  }

  const saved = descRepo.upsert(breed, description);
  res.json({ ok: true, breed, ...saved });
});


//breed lists
app.get("/breeds", async (_req, res) => {
  try {
    const r = await fetch("https://dog.ceo/api/breeds/list/all");
    const j = await r.json(); // { message: { akita:[], ... }, status }
    const breeds = Object.keys(j.message || {}).sort();
    res.json({ breeds });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Upstream error" });
  }
});

//image for a breed
app.get("/breeds/:breed", async (req, res) => {
  const { breed } = req.params;
  const count = Number(req.query.count || 12);
  try {
    const r = await fetch(
      `https://dog.ceo/api/breed/${encodeURIComponent(breed)}/images/random/${count}`
    );
    const j = await r.json(); 
    res.json({ images: j.message || [] });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Upstream error" });
  }
});

//get descr
app.get("/breeds/:breed/description", (req, res) => {
  const { breed } = req.params;
  const row = descRepo.getOne(breed);
  if (!row) return res.json({ breed, description: null, updated_at: null });
  res.json(row);
});

//Upsert descr
app.put("/breeds/:breed/description", (req, res) => {
  const { breed } = req.params;
  const description = (req.body?.description || "").trim();
  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }
  const saved = descRepo.upsert(breed, description);
  res.json({ ok: true, ...saved });
});

//dog fact with an image
// dog fact with an image (robust + fallbacks)
app.get("/dogfact", async (_req, res) => {
  try {
    // 1) image
    const imgRes = await fetch("https://dog.ceo/api/breeds/image/random");
    if (!imgRes.ok) throw new Error(`Image API ${imgRes.status}`);
    const imgJson = await imgRes.json();
    const image = imgJson?.message;
    if (!image) throw new Error("No image field in Dog CEO response");

    // 2) primary fact source: dogapi.dog (JSON:API)
    //    correct way to request one item: page[size]=1
    let fact = null;
    const factRes = await fetch("https://dogapi.dog/api/v2/facts?page[size]=1", {
      headers: { Accept: "application/vnd.api+json, application/json" },
    });

    if (factRes.ok) {
      const factJson = await factRes.json();
      fact = factJson?.data?.[0]?.attributes?.body || null;
    } else {
      console.error("dogapi.dog failed:", factRes.status);
    }

    // 3) fallback #1: Some Random API
    if (!fact) {
      const sr = await fetch("https://api.some-random-api.com/facts/dog");
      if (sr.ok) {
        const sj = await sr.json();
        fact = sj?.fact || null;
      } else {
        console.error("some-random-api failed:", sr.status);
      }
    }

    // 4) fallback #2: Kinduff legacy API
    if (!fact) {
      const k = await fetch("https://dog-api.kinduff.com/api/facts");
      if (k.ok) {
        const kj = await k.json();
        fact = Array.isArray(kj?.facts) ? kj.facts[0] : null;
      } else {
        console.error("kinduff dog-api failed:", k.status);
      }
    }

    if (!fact) fact = "Couldn't fetch a dog fact right now.";

    res.json({ image, fact });
  } catch (err) {
    console.error("Failed /dogfact:", err);
    res.status(502).json({ error: "Failed to fetch dog fact/image" });
  }
});



app.use("/public", express.static(path.join(__dirname, "public")));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
