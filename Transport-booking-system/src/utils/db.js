const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/db.json');

const DEFAULT_DB = { users: [], trips: [], bookings: [] };

let writeQueue = Promise.resolve();

async function ensureDBExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

async function readDB() {
  await ensureDBExists();
  const raw = await fs.readFile(DB_PATH, 'utf-8');

  if (!raw.trim()) {
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return { ...DEFAULT_DB };
  }

  try {
    const data = JSON.parse(raw);

    return { ...DEFAULT_DB, ...data };
  } catch (err) {
    throw new Error(`db.json is corrupted and could not be parsed: ${err.message}`);
  }
}

async function writeDB(data) {

  writeQueue = writeQueue.then(() =>
    fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
  );
  return writeQueue;
}

async function updateDB(mutatorFn) {
  writeQueue = writeQueue.then(async () => {
    const raw = await fs.readFile(DB_PATH, 'utf-8').catch(() => JSON.stringify(DEFAULT_DB));
    const current = raw.trim() ? JSON.parse(raw) : { ...DEFAULT_DB };
    const updated = await mutatorFn(current);
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
    return updated;
  });
  return writeQueue;
}

module.exports = { readDB, writeDB, updateDB };