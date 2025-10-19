import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function openDb() {
  return open({
    filename: join(__dirname, "agenda.db"),
    driver: sqlite3.Database,
  });
}
