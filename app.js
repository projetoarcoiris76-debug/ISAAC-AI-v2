/* =========================================================
   GAMERULTRA AI - ZAK
   APP.JS
   ========================================================= */


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const API_URL = "/api/chat";

const SENHA_CORRETA = "SUA_SENHA_AQUI";

let historico = [];

let modoAtual = "normal";

let pesquisaWebAtiva = false;

let enviando = false;


/* =========================================================
   ELEMENTOS DA PÁGINA
   ========================================================= */

const login = document.getElementById("login");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("password");

const showPassword = document.getElementById("showPassword");

const error = document.getElementById("error");

const chat = document.getElementById("chat");

const input = document.getElementById("input");

const messages = document.getElementById("messages");

const typing = document.getElementById("typing");

const sendButton = document.getElementById("sendButton");

const clearChat = document.getElementById("clearChat");

const webSearchButton =
  document.getElementById("webSearchButton");


/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

  loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const senha = passwordInput.value;

    if (senha === SENHA_CORRETA) {

      error.textContent = "";

      login.classList.add("hidden");

      app.classList.remove("hidden");

      input.focus();

    } else {

      error.textContent =
        "❌ Senha incorreta.";

      passwordInput.value = "";

      passwordInput.focus();
    }

  });

}


/* =========================================================
   MOSTRAR / ESCONDER SENHA
   ========================================================= */

if (showPassword) {

  showPassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

      passwordInput.type = "text";

      showPassword.textContent = "🙈";

    } else {

      passwordInput.type = "password";

      showPassword.textContent = "👁️";

    }

  });

}


/* =========================================================
   ADICIONAR MENSAGEM NA TELA
   ========================================================= */

function adicionarMensagem(texto, tipo = "zak") {

  if (!messages) return;

  const message = document.createElement("div");

  message.className =
    tipo === "user"
      ? "message user-message"
      : "message zak-message";


  const avatar = document.createElement("div");

  avatar.className = "message-avatar";

  avatar.textContent =
    tipo === "user"
      ? "👤"
      : "🤖";


  const content = document.createElement("div");

  content.className = "message-content";


  const nome = document.createElement("strong");

  nome.textContent =
    tipo === "user"
      ? "VOCÊ"
      : "ZAK";


  const textoMensagem = document.createElement("p");

  textoMensagem.textContent = texto;


  content.appendChild(nome);

  content.appendChild(textoMensagem);

  message.appendChild(avatar);

  message.appendChild(content);

  messages.appendChild(message);


  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================================================
   INDICADOR "ZAK ESTÁ PENSANDO"
   ========================================================= */

function mostrarPensando() {

  if (typing) {

    typing.classList.remove("hidden");

    messages.scrollTop =
      messages.scrollHeight;
  }

}


function esconderPensando() {

  if (typing) {

    typing.classList.add("hidden");

  }

}


/* =========================================================
   DESATIVAR / ATIVAR ENVIO
   ========================================================= */

function mudarEstadoEnvio(estado) {

  enviando = estado;

  if (!sendButton) return;

  sendButton.disabled = estado;

  sendButton.style.opacity =
    estado ? "0.5" : "1";

  sendButton.style.cursor =
    estado ? "not-allowed" : "pointer";

}


/* =========================================================
   PERSONALIDADE DO ZAK
   ========================================================= */

function prepararMensagemParaZak(mensagem) {

  return {

    role: "user",

    content: mensagem

  };

}


/* =========================================================
   ENVIAR MENSAGEM PARA A IA
   ========================================================= */

async function conversarComZak(mensagem) {

  const novaMensagem =
    prepararMensagemParaZak(mensagem);


  historico.push(novaMensagem);


  try {

    const resposta = await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          messages: historico,

          mode: modoAtual,

          web_search:
            pesquisaWebAtiva

        })

      }
    );


    if (!resposta.ok) {

      throw new Error(
        "Servidor respondeu com erro."
      );

    }


    const dados =
      await resposta.json();


    if (!dados || !dados.reply) {

      throw new Error(
        "A IA não retornou uma resposta válida."
      );

    }


    const respostaZak =
      dados.reply;


    historico.push({

      role: "assistant",

      content: respostaZak

    });


    return respostaZak;


  } catch (erro) {

    console.error(
      "Erro ao conversar com ZAK:",
      erro
    );


    /*
      Se o servidor ainda não estiver configurado,
      mostramos uma mensagem explicando o problema.
    */

    historico.pop();

    return (
      "⚠️ O cérebro principal do ZAK ainda " +
      "não está conectado ao servidor.\n\n" +
      "Quando o server.js estiver configurado, " +
      "eu vou poder usar a IA real."
    );

  }

}


/* =========================================================
   ENVIO DO CHAT
   ========================================================= */

if (chat) {

  chat.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (enviando) return;


      const mensagem =
        input.value.trim();


      if (!mensagem) return;


      adicionarMensagem(
        mensagem,
        "user"
      );


      input.value = "";


      mudarEstadoEnvio(true);

      mostrarPensando();


      try {

        const resposta =
          await conversarComZak(
            mensagem
          );


        esconderPensando();


        adicionarMensagem(
          resposta,
          "zak"
        );


      } catch (erro) {

        esconderPensando();


        adicionarMensagem(
          "❌ Tive um problema para responder. Tente novamente.",
          "zak"
        );

      }


      mudarEstadoEnvio(false);

      input.focus();

    }
  );

}


/* =========================================================
   LIMPAR CONVERSA
   ========================================================= */

if (clearChat) {

  clearChat.addEventListener(
    "click",
    function () {

      historico = [];

      messages.innerHTML = "";


      adicionarMensagem(
        "Conversa limpa. 😎 Bora começar de novo! O que você quer fazer?",
        "zak"
      );


      input.focus();

    }
  );

}


/* =========================================================
   PESQUISA NA WEB
   ========================================================= */

if (webSearchButton) {

  webSearchButton.addEventListener(
    "click",
    function () {

      pesquisaWebAtiva =
        !pesquisaWebAtiva;


      if (pesquisaWebAtiva) {

        webSearchButton.textContent =
          "🌐 Pesquisa Web: ON";

        webSearchButton.classList.add(
          "active"
        );

        adicionarMensagem(
          "🌐 Modo pesquisa ativado. Quando eu responder, poderei usar informações atuais da web.",
          "zak"
        );

      } else {

        webSearchButton.textContent =
          "🌐 Pesquisa Web";

        webSearchButton.classList.remove(
          "active"
        );

        adicionarMensagem(
          "🌐 Pesquisa web desativada.",
          "zak"
        );

      }

    }
  );

}


/* =========================================================
   MODOS DO ZAK
   ========================================================= */

const modeButtons =
  document.querySelectorAll(
    ".mode-button"
  );


modeButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        modeButtons.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        modoAtual =
          button.dataset.mode ||
          "normal";


        const nomes = {

          normal:
            "💬 Modo conversa ativado.",

          programacao:
            "💻 Modo programação ativado.",

          jogos:
            "🎮 Modo criação de jogos ativado.",

          criatividade:
            "🎨 Modo criatividade ativado.",

          pesquisa:
            "🔎 Modo pesquisa ativado."

        };


        adicionarMensagem(
          nomes[modoAtual] ||
          "Modo alterado.",
          "zak"
        );


        input.focus();

      }
    );

  }
);


/* =========================================================
   ENTER PARA ENVIAR
   ========================================================= */

if (input) {

  input.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        if (chat) {

          chat.requestSubmit();

        }

      }

    }
  );

}


/* =========================================================
   ATALHO CTRL + K
   LIMPAR CONVERSA
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      if (clearChat) {

        clearChat.click();

      }

    }

  }
);


/* =========================================================
   MENSAGEM INICIAL
   ========================================================= */

console.log(
  "🤖 ZAK iniciado."
);

console.log(
  "👑 Criador: IsaacGamer18Sonic"
);

console.log(
  "🤖 Mãe na lore: ChatGPT"
);

console.log(
  "🧠 Modo atual:",
  modoAtual
);
