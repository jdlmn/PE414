// backend/db.js
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const dbPath = path.join(DATA_DIR, "dogapi.db");
const db = new Database(dbPath);


db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");


db.exec(`
  CREATE TABLE IF NOT EXISTS breed_descriptions (
    breed TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
