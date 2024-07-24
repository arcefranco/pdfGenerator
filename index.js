import express from "express";
import fs from "fs";
import path from "path";
import { generatePdf } from "./pdfGenerator.js";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const WS_PORT = 3001;

const wss = new WebSocketServer({ port: WS_PORT });

app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/output.pdf", (req, res) => {
  res.sendFile(path.join(__dirname, "views/output.pdf"));
});

app.get("/generate-pdf", (req, res) => {
  generatePdf(path.join(__dirname, "views/output.pdf"))
    .then(() => {
      res.sendFile(path.join(__dirname, "views/output.pdf"));
    })
    .catch((err) => {
      res.status(500).send("Error generating PDF");
      console.error("Error generating PDF:", err);
    });
});

// Genera el PDF inicial al arrancar el servidor
generatePdf(path.join(__dirname, "views/output.pdf"))
  .then(() => {
    console.log("PDF inicial generado.");
  })
  .catch((err) => {
    console.error("Error generating initial PDF:", err);
  });

// Observa el archivo generado
chokidar.watch(path.join(__dirname, "views/output.pdf")).on("change", () => {
  console.log("PDF file changed. Notifying clients...");
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send("reload");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");
});

wss.on("error", (err) => {
  console.error("WebSocket error:", err);
});
