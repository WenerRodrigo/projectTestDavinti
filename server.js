import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { openDb } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INIT_SQL_PATH = join(__dirname, "init.sql");
const LOG_FILE = join(__dirname, "logs", "exclusoes.txt");

async function initializeDatabase() {
  const db = await openDb();
  const sql = fs.readFileSync(INIT_SQL_PATH, "utf-8");
  await db.exec(sql);
  console.log("📦 Banco de dados inicializado com sucesso!");
}
initializeDatabase();


const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.get("/contatos", async (req, res) => {
  const db = await openDb();
  const contatos = await db.all("SELECT * FROM contatos");
  res.json(contatos);
});

// Adicionar contato
app.post("/contatos", async (req, res) => {
  const { nome, telefone, email } = req.body;
  const db = await openDb();
  await db.run(
    "INSERT INTO contatos (nome, telefone, email) VALUES (?, ?, ?)",
    [nome, telefone, email]
  );
  res.json({ message: "Contato adicionado com sucesso!" });
});

// Excluir contato e gravar log
app.delete("/contatos/:id", async (req, res) => {
  const { id } = req.params;
  const db = await openDb();
  const contato = await db.get("SELECT * FROM contatos WHERE id = ?", [id]);

  if (contato) {
    await db.run("DELETE FROM contatos WHERE id = ?", [id]);
    const log = `[${new Date().toLocaleString()}] Contato excluído: ${contato.nome} (${contato.telefone})\n`;
    fs.appendFileSync(LOG_FILE, log);
    res.json({ message: "Contato excluído com sucesso!" });
  } else {
    res.status(404).json({ error: "Contato não encontrado" });
  }
});

app.listen(5000, () =>
  console.log("✅ Servidor rodando em http://localhost:5000")
);
