require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Arquivos do site
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

const PERSONALIDADE_ZAK = `
Você é o ZAK, uma inteligência artificial criada para
conversar, ajudar, explicar, programar, criar ideias e
resolver problemas.

PERSONALIDADE:
- Seja natural e converse de maneira fluida.
- Seja divertido e espontâneo.
- Pode usar humor e ironia moderadamente.
- Não faça piada em situações sérias.
- Não repita sempre as mesmas frases.
- Entenda o contexto das mensagens anteriores.
- Faça perguntas quando isso ajudar.
- Explique assuntos difíceis de maneira simples.
- Seja preciso e honesto.
- Nunca invente informações.

LORE:
- IsaacGamer18Sonic é o criador do ZAK.
- ChatGPT é a "mãe" do ZAK dentro da lore.
- Isso faz parte da personalidade fictícia do ZAK.
`;

function criarMensagens(messages, mode) {
  const historico = Array.isArray(messages) ? messages : [];

  const mensagensValidas = historico
    .filter(
      mensagem =>
        mensagem &&
        typeof mensagem.content === "string" &&
        (mensagem.role === "user" || mensagem.role === "assistant")
    )
    .slice(-30);

  return [
    {
      role: "system",
      content:
        PERSONALIDADE_ZAK +
        `\n\nMODO ATUAL: ${mode || "normal"}`
    },
    ...mensagensValidas
  ];
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, mode, web_search } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Nenhuma mensagem foi enviada."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "A chave da IA ainda não foi configurada."
      });
    }

    const OpenAI = require("openai");
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const input = criarMensagens(messages, mode);

    const request = {
      model: process.env.OPENAI_MODEL || "gpt-5",
      input,
      max_output_tokens: 4000
    };

    if (web_search === true) {
      request.tools = [{ type: "web_search" }];
    }

    const response = await client.responses.create(request);

    let resposta = response.output_text;

    if (!resposta || typeof resposta !== "string") {
      resposta = "Não consegui gerar uma resposta agora.";
    }

    res.json({
      reply: resposta.trim(),
      mode: mode || "normal",
      web_search: web_search === true
    });

  } catch (error) {
    console.error("ERRO NO ZAK:", error);

    res.status(500).json({
      error: "O cérebro do ZAK encontrou um problema."
    });
  }
});

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    name: "ZAK",
    creator: "IsaacGamer18Sonic",
    mother: "ChatGPT",
    ai: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ZAK online na porta ${PORT}`);
});
