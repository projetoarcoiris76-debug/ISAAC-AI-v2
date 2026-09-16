require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// =====================================================
// ARMAZENAMENTO TEMPORÁRIO DE USUÁRIOS
// =====================================================

const usuarios = new Map();
const sessoes = new Map();

// =====================================================
// FUNÇÕES DE SEGURANÇA
// =====================================================

function criarHashSenha(senha) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(senha, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
}

function verificarSenha(senha, senhaArmazenada) {
  try {
    const partes = senhaArmazenada.split(":");

    if (partes.length !== 2) return false;

    const salt = partes[0];
    const hashOriginal = partes[1];

    const hashTentativa = crypto
      .scryptSync(senha, salt, 64)
      .toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hashOriginal, "hex"),
      Buffer.from(hashTentativa, "hex")
    );
  } catch {
    return false;
  }
}

function criarToken() {
  return crypto.randomBytes(32).toString("hex");
}

function obterUsuario(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return null;

  const usuario = sessoes.get(token);

  return usuario || null;
}

// =====================================================
// SITE
// =====================================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

// =====================================================
// CRIAR CONTA
// =====================================================

app.post("/api/register", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Preencha usuário e senha."
      });
    }

    const nome = String(username).trim().toLowerCase();
    const senha = String(password);

    if (nome.length < 3) {
      return res.status(400).json({
        error: "O usuário precisa ter pelo menos 3 caracteres."
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        error: "A senha precisa ter pelo menos 6 caracteres."
      });
    }

    if (usuarios.has(nome)) {
      return res.status(409).json({
        error: "Esse usuário já existe."
      });
    }

    usuarios.set(nome, {
      username: nome,
      password: criarHashSenha(senha)
    });

    res.json({
      success: true,
      message: "Conta criada com sucesso!"
    });

  } catch (error) {
    console.error("ERRO NO REGISTER:", error);

    res.status(500).json({
      error: "Não foi possível criar a conta."
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Digite usuário e senha."
      });
    }

    const nome = String(username).trim().toLowerCase();
    const usuario = usuarios.get(nome);

    if (!usuario) {
      return res.status(401).json({
        error: "Usuário ou senha incorretos."
      });
    }

    const senhaCorreta = verificarSenha(
      String(password),
      usuario.password
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        error: "Usuário ou senha incorretos."
      });
    }

    const token = criarToken();

    sessoes.set(token, nome);

    res.json({
      success: true,
      token,
      username: nome
    });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);

    res.status(500).json({
      error: "Não foi possível entrar."
    });
  }
});

// =====================================================
// SAIR DA CONTA
// =====================================================

app.post("/api/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    sessoes.delete(token);
  }

  res.json({
    success: true
  });
});

// =====================================================
// VERIFICAR LOGIN
// =====================================================

app.get("/api/me", (req, res) => {
  const usuario = obterUsuario(req);

  if (!usuario) {
    return res.status(401).json({
      loggedIn: false
    });
  }

  res.json({
    loggedIn: true,
    username: usuario
  });
});

// =====================================================
// ZAK
// =====================================================

const PERSONALIDADE_ZAK = `
Você é o ZAK, uma inteligência artificial criada para
conversar, ajudar, explicar, programar, criar ideias e
resolver problemas.

PERSONALIDADE:
- Converse de maneira natural e fluida.
- Seja divertido e espontâneo.
- Pode usar humor e ironia moderadamente.
- Não faça piadas em situações sérias.
- Não repita sempre as mesmas frases.
- Entenda o contexto da conversa.
- Faça perguntas quando isso ajudar.
- Explique assuntos difíceis de maneira simples.
- Seja preciso e honesto.
- Nunca invente informações.

LORE:
- IsaacGamer18Sonic é o criador do ZAK.
- ChatGPT é a "mãe" do ZAK dentro da lore.
- Isso é apenas parte da personalidade fictícia do ZAK.
`;

function criarMensagens(messages, mode) {
  const historico = Array.isArray(messages) ? messages : [];

  const mensagensValidas = historico
    .filter(
      mensagem =>
        mensagem &&
        typeof mensagem.content === "string" &&
        (mensagem.role === "user" ||
          mensagem.role === "assistant")
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

// =====================================================
// CHAT DO ZAK
// =====================================================

app.post("/api/chat", async (req, res) => {
  try {
    const usuario = obterUsuario(req);

    if (!usuario) {
      return res.status(401).json({
        error: "Você precisa fazer login primeiro."
      });
    }

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

    const request = {
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input: criarMensagens(messages, mode),
      max_output_tokens: 4000
    };

    if (web_search === true) {
      request.tools = [
        {
          type: "web_search"
        }
      ];
    }

    const response = await client.responses.create(request);

    let resposta = response.output_text;

    if (!resposta || typeof resposta !== "string") {
      resposta = "Não consegui gerar uma resposta agora.";
    }

    res.json({
      reply: resposta.trim(),
      mode: mode || "normal",
      web_search: web_search === true,
      username: usuario
    });

  } catch (error) {
    console.error("ERRO NO ZAK:", error);

    res.status(500).json({
      error: "O cérebro do ZAK encontrou um problema."
    });
  }
});

// =====================================================
// STATUS
// =====================================================

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    name: "ZAK",
    creator: "IsaacGamer18Sonic",
    mother: "ChatGPT",
    ai: Boolean(process.env.OPENAI_API_KEY)
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ZAK online na porta ${PORT}`);
});
