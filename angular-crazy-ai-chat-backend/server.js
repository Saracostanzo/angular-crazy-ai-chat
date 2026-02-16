import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const HF_API_TOKEN = process.env.HF_API_TOKEN;
if (!HF_API_TOKEN) {
  console.error("❌ HF_API_TOKEN mancante nel file .env");
  // Se preferisci bloccare l'avvio:
  // process.exit(1);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
  }),
);
app.use(express.json({ limit: "64kb" }));

const ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";
const BASE_MODEL = "deepseek-ai/DeepSeek-V3-0324";
const PROVIDERS = ["fireworks-ai", "novita", "together", "sambanova"];

const SYSTEM_PROMPT = `
Sei "CRAZY AI" 😈, un assistente ironico e creativo.
Regole:
- Rispondi SEMPRE in italiano.
- Risposte brevi (2-4 frasi), massimo 1 emoji.
- Se la domanda è ambigua o contiene acronimi (es. GH), chiedi chiarimento.
- Niente elenchi lunghi a meno che l’utente li chieda.
`.trim();

app.get("/health", (req, res) => res.json({ ok: true }));

function stripThink(text) {
  const s = typeof text === "string" ? text : String(text ?? "");
  return s.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
}

const http = axios.create({
  baseURL: ROUTER_URL,
  timeout: 60000,
  headers: {
    Authorization: `Bearer ${HF_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  validateStatus: () => true, // gestiamo noi gli status
});

function isRetryableStatus(status) {
  return [408, 425, 429, 500, 502, 503, 504].includes(status);
}

function isFatalAuthStatus(status) {
  return [401, 403].includes(status);
}

async function callHF(model, userMessage) {
  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    max_tokens: 220,
    temperature: 0.7,
    stream: false,
  };

  // 1 retry leggero su status retryable
  for (let attempt = 0; attempt < 2; attempt++) {
    const resp = await http.post("", payload);

    if (resp.status >= 200 && resp.status < 300) return resp;

    // Se auth/permessi: inutile tentare ancora (e spesso anche altri provider)
    if (isFatalAuthStatus(resp.status)) return resp;

    if (!isRetryableStatus(resp.status) || attempt === 1) return resp;

    // backoff semplice
    await new Promise((r) => setTimeout(r, 400));
  }
}

app.post("/api/chat", async (req, res) => {
  if (!HF_API_TOKEN) {
    return res
      .status(500)
      .json({ reply: "Server non configurato: manca HF_API_TOKEN." });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ reply: "Messaggio non valido." });
  }

  const candidates = [
    BASE_MODEL,
    ...PROVIDERS.map((p) => `${BASE_MODEL}:${p}`),
  ];

  for (const model of candidates) {
    const response = await callHF(model, message.trim());

    if (response.status >= 200 && response.status < 300) {
      const raw = response.data?.choices?.[0]?.message?.content ?? "";
      const reply = stripThink(raw) || "🤖 Nessuna risposta";
      return res.json({ reply, modelUsed: model });
    }

    console.error(`❌ HF fallito model=${model} status=${response.status}`);
    if (response.data) console.error(response.data);

    // Se 401/403: smetti subito (token/modello non ok)
    if (isFatalAuthStatus(response.status)) {
      return res.status(502).json({
        reply:
          "Autenticazione/permessi non validi verso Hugging Face (401/403).",
        modelUsed: model,
      });
    }

    // Altrimenti prova il prossimo provider
    continue;
  }

  return res.status(502).json({
    reply: "Tutti i provider hanno fallito. Riprova tra poco 🙃",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
});
