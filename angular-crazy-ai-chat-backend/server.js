import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const HF_API_TOKEN = process.env.HF_API_TOKEN;
if (!HF_API_TOKEN) {
  console.error("❌ HF_API_TOKEN mancante nel file .env");
}


const ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";


const BASE_MODEL = "deepseek-ai/DeepSeek-V3-0324";


const PROVIDERS = ["fireworks-ai", "novita", "together", "sambanova"];

// Prompt di sistema per rendere la chat “crazy” e in italiano
const SYSTEM_PROMPT = `
Sei "CRAZY AI" 😈, un assistente ironico e creativo.
Regole:
- Rispondi SEMPRE in italiano.
- Risposte brevi (2-4 frasi), massimo 1 emoji.
- Se la domanda è ambigua o contiene acronimi (es. GH), chiedi chiarimento.
- Niente elenchi lunghi a meno che l’utente li chieda.
`;


app.get("/health", (req, res) => res.json({ ok: true }));

function stripThink(text = "") {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
}

async function callHF(model, userMessage) {
  return axios.post(
    ROUTER_URL,
    {
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT.trim() },
        { role: "user", content: userMessage }
      ],
      max_tokens: 220,
      temperature: 0.7,
      stream: false
    },
    {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      timeout: 60000
    }
  );
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Messaggio non valido." });
  }


  const candidates = [
    BASE_MODEL,
    ...PROVIDERS.map((p) => `${BASE_MODEL}:${p}`)
  ];

  for (const model of candidates) {
    try {
      const response = await callHF(model, message);

      const raw = response.data?.choices?.[0]?.message?.content ?? "";
      const reply = stripThink(raw) || "🤖 Nessuna risposta";

      return res.json({ reply, modelUsed: model });
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      console.error(`❌ HF fallito model=${model} status=${status}`);
      if (data) console.error(data);

     
      continue;
    }
  }

  return res.status(502).json({
    reply: "Tutti i provider hanno fallito. Riprova tra poco 🙃"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
});
