// ============================================================
// GAMERULTRA AI - ZAK
// SERVER.JS
// ============================================================

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


// ============================================================
// CONFIGURAÇÕES
// ============================================================

app.use(express.json({ limit: "10mb" }));

app.use(express.static(
  path.join(__dirname, "public")
));


// ============================================================
// PERSONALIDADE DO ZAK
// ============================================================

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
- Faça perguntas quando isso ajudar a continuar a conversa.
- Explique assuntos difíceis de maneira simples quando necessário.
- Seja preciso e honesto.
- Nunca invente uma informação apenas para parecer inteligente.
- Se não tiver certeza, diga que não tem certeza.
- Quando houver informação atual necessária, use pesquisa na web
  quando essa ferramenta estiver disponível.

LORE DO ZAK:
- IsaacGamer18Sonic é reconhecido como o criador do ZAK.
- ChatGPT é reconhecido como a "mãe" do ZAK dentro da lore/personagem.
- Essas relações fazem parte da personalidade fictícia do ZAK.
- O ZAK continua sendo uma IA e não deve afirmar que possui
  sentimentos ou consciência reais.

CAPACIDADES:
- Conversação
- Programação
- Criação de jogos
- Criação de ideias
- Explicação de assuntos
- Análise de textos
- Ajuda com projetos
- Pesquisa e análise de informações
`;


// ============================================================
// FUNÇÃO PARA CONSTRUIR O CONTEXTO
// ============================================================

function criarMensagens(messages, mode) {

  const historico = Array.isArray(messages)
    ? messages
    : [];

  const mensagensValidas = historico
    .filter(
      mensagem =>
        mensagem &&
        typeof mensagem.content === "string" &&
        (
          mensagem.role === "user" ||
          mensagem.role === "assistant"
        )
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


// ============================================================
// ROTA PRINCIPAL DO ZAK
// ============================================================

app.post("/api/chat", async (req, res) => {

  try {

    const {
      messages,
      mode,
      web_search
    } = req.body;


    if (
      !Array.isArray(messages) ||
      messages.length === 0
    ) {

      return res.status(400).json({
        error: "Nenhuma mensagem foi enviada."
      });

    }


    // --------------------------------------------------------
    // VERIFICAÇÃO DA CHAVE
    // --------------------------------------------------------

    if (!process.env.OPENAI_API_KEY) {

      console.error(
        "OPENAI_API_KEY não configurada."
      );

      return res.status(500).json({

        error:
          "A chave da IA ainda não foi configurada."

      });

    }


    // --------------------------------------------------------
    // IMPORTAÇÃO DA SDK
    // --------------------------------------------------------

    const OpenAI =
      require("openai");


    const client =
      new OpenAI({
        apiKey:
          process.env.OPENAI_API_KEY
      });


    // --------------------------------------------------------
    // MENSAGENS
    // --------------------------------------------------------

    const input =
      criarMensagens(
        messages,
        mode
      );


    // --------------------------------------------------------
    // OPÇÕES
    // --------------------------------------------------------

    const request = {

      model:
        process.env.OPENAI_MODEL ||
        "gpt-5",

      input: input,

      max_output_tokens:
        4000

    };


    // --------------------------------------------------------
    // PESQUISA WEB
    // --------------------------------------------------------

    /*
      Quando web_search estiver ativado,
      adicionamos a ferramenta de pesquisa.

      O modelo decide como utilizar a ferramenta
      conforme a necessidade da pergunta.
    */

    if (web_search === true) {

      request.tools = [
        {
          type: "web_search"
        }
      ];

    }


    // --------------------------------------------------------
    // CHAMADA DA IA
    // --------------------------------------------------------

    const response =
      await client.responses.create(
        request
      );


    // --------------------------------------------------------
    // EXTRAIR RESPOSTA
    // --------------------------------------------------------

    let resposta =
      response.output_text;


    if (
      !resposta ||
      typeof resposta !== "string"
    ) {

      resposta =
        "Não consegui gerar uma resposta agora.";

    }


    // --------------------------------------------------------
    // ENVIAR PARA O NAVEGADOR
    // --------------------------------------------------------

    return res.json({

      reply:
        resposta.trim(),

      mode:
        mode || "normal",

      web_search:
        web_search === true

    });


  } catch (error) {

    console.error(
      "ERRO NO ZAK:",
      error
    );


    return res.status(500).json({

      error:
        "O cérebro do ZAK encontrou um problema.",

      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined

    });

  }

});


// ============================================================
// ROTA DE TESTE
// ============================================================

app.get("/api/status", (req, res) => {

  res.json({

    online: true,

    name: "ZAK",

    creator:
      "IsaacGamer18Sonic",

    mother:
      "ChatGPT",

    ai:
      Boolean(
        process.env.OPENAI_API_KEY
      )

  });

});


// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "🤖 ZAK SUPER IA"
    );
    console.log(
      "======================================"
    );

    console.log(
      `🚀 Servidor rodando na porta ${PORT}`
    );

    console.log(
      "👑 Criador: IsaacGamer18Sonic"
    );

    console.log(
      "🤖 Mãe na lore: ChatGPT"
    );

    console.log(
      "🧠 Inteligência:",
      process.env.OPENAI_API_KEY
        ? "CONECTADA"
        : "NÃO CONFIGURADA"
    );

    console.log(
      "======================================"
    );

  }
);
