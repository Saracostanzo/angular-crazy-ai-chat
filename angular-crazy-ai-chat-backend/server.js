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

// HF Router chat endpoint
const ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";


const MODEL = "deepseek-ai/DeepSeek-V3-0324";

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      ROUTER_URL,
      {
        model: MODEL,
        messages: [{ role: "user", content: message }],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "🤖 Nessuna risposta";
    res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      reply: "Oops, errore con Hugging Face 😅",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
});
