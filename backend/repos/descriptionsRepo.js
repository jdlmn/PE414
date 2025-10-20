import db from "../db.js";

const listAllStmt = db.prepare(
  "SELECT breed, description, updated_at FROM breed_descriptions ORDER BY breed"
);
const getOneStmt = db.prepare(
  "SELECT breed, description, updated_at FROM breed_descriptions WHERE breed = ?"
);
const upsertStmt = db.prepare(`
  INSERT INTO breed_descriptions (breed, description, updated_at)
  VALUES (?, ?, datetime('now'))
  ON CONFLICT(breed) DO UPDATE SET
    description = excluded.description,
    updated_at = excluded.updated_at
  RETURNING breed, description, updated_at
`);

export function listAll() {
  return listAllStmt.all();
}

export function getOne(breed) {
  return getOneStmt.get(breed);
}

export function upsert(breed, description) {
  return upsertStmt.get(breed, description);
}
