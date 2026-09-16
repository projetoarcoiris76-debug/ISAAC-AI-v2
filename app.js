const API_URL = "/api/chat";

// =====================================================
// ELEMENTOS
// =====================================================

const loginScreen = document.getElementById("login");
const registerScreen = document.getElementById("register");
const appScreen = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");

const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const registerSuccess = document.getElementById("registerSuccess");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const showLoginPassword =
  document.getElementById("showLoginPassword");

const showRegisterPassword =
  document.getElementById("showRegisterPassword");

const logoutButton =
  document.getElementById("logoutButton");

const loggedUser =
  document.getElementById("loggedUser");

const chat =
  document.getElementById("chat");

const input =
  document.getElementById("input");

const messages =
  document.getElementById("messages");

const typing =
  document.getElementById("typing");

const clearChat =
  document.getElementById("clearChat");

const webSearchButton =
  document.getElementById("webSearchButton");

const modeButtons =
  document.querySelectorAll(".mode-button");


// =====================================================
// ESTADO
// =====================================================

let token = localStorage.getItem("zak_token");
let username = localStorage.getItem("zak_username");

let historico = [];

let modoAtual = "normal";
let pesquisaWeb = false;


// =====================================================
// TELAS
// =====================================================

function mostrarLogin() {
  loginScreen.classList.remove("hidden");
  registerScreen.classList.add("hidden");
  appScreen.classList.add("hidden");
}

function mostrarCadastro() {
  loginScreen.classList.add("hidden");
  registerScreen.classList.remove("hidden");
  appScreen.classList.add("hidden");
}

function mostrarApp(nome) {
  loginScreen.classList.add("hidden");
  registerScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  loggedUser.textContent = `👤 ${nome}`;

  setTimeout(() => {
    input.focus();
  }, 200);
}


// =====================================================
// MOSTRAR / ESCONDER SENHA
// =====================================================

function configurarSenha(button, campo) {
  if (!button || !campo) return;

  button.addEventListener("click", () => {
    if (campo.type === "password") {
      campo.type = "text";
      button.textContent = "🙈";
    } else {
      campo.type = "password";
      button.textContent = "👁️";
    }
  });
}

configurarSenha(
  showLoginPassword,
  loginPassword
);

configurarSenha(
  showRegisterPassword,
  registerPassword
);


// =====================================================
// TROCAR LOGIN / CADASTRO
// =====================================================

showRegister.addEventListener("click", () => {
  loginError.textContent = "";
  registerError.textContent = "";
  registerSuccess.textContent = "";

  mostrarCadastro();

  registerUsername.focus();
});

showLogin.addEventListener("click", () => {
  registerError.textContent = "";
  registerSuccess.textContent = "";

  mostrarLogin();

  loginUsername.focus();
});


// =====================================================
// CADASTRO
// =====================================================

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  registerError.textContent = "";
  registerSuccess.textContent = "";

  const usernameValue =
    registerUsername.value.trim();

  const passwordValue =
    registerPassword.value;

  if (!usernameValue || !passwordValue) {
    registerError.textContent =
      "⚠️ Preencha usuário e senha.";

    return;
  }

  try {

    registerSuccess.textContent =
      "⏳ Criando sua conta...";

    const response = await fetch("/api/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Erro ao criar conta."
      );
    }

    registerSuccess.textContent =
      "✅ Conta criada! Agora faça login.";

    registerForm.reset();

    setTimeout(() => {
      mostrarLogin();

      loginUsername.value =
        usernameValue;

      loginPassword.focus();
    }, 1000);

  } catch (error) {

    console.error(error);

    registerSuccess.textContent = "";

    registerError.textContent =
      "❌ " + error.message;
  }
});


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginError.textContent = "";

  const usernameValue =
    loginUsername.value.trim();

  const passwordValue =
    loginPassword.value;

  if (!usernameValue || !passwordValue) {
    loginError.textContent =
      "⚠️ Digite usuário e senha.";

    return;
  }

  try {

    loginError.textContent =
      "⏳ Entrando...";

    const response = await fetch("/api/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Erro ao entrar."
      );
    }

    token = data.token;
    username = data.username;

    localStorage.setItem(
      "zak_token",
      token
    );

    localStorage.setItem(
      "zak_username",
      username
    );

    loginError.textContent = "";

    loginForm.reset();

    historico = [];

    mostrarApp(username);

  } catch (error) {

    console.error(error);

    loginError.textContent =
      "❌ " + error.message;
  }
});


// =====================================================
// VERIFICAR SESSÃO
// =====================================================

async function verificarSessao() {

  if (!token) {
    mostrarLogin();
    return;
  }

  try {

    const response = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Sessão inválida.");
    }

    const data = await response.json();

    username = data.username;

    localStorage.setItem(
      "zak_username",
      username
    );

    mostrarApp(username);

  } catch {

    localStorage.removeItem("zak_token");
    localStorage.removeItem("zak_username");

    token = null;
    username = null;

    mostrarLogin();
  }
}


// =====================================================
// LOGOUT
// =====================================================

logoutButton.addEventListener("click", async () => {

  try {

    if (token) {
      await fetch("/api/logout", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

  } catch {
    // Mesmo que o servidor falhe,
    // vamos sair localmente.
  }

  localStorage.removeItem("zak_token");
  localStorage.removeItem("zak_username");

  token = null;
  username = null;
  historico = [];

  messages.innerHTML = "";

  loginForm.reset();

  mostrarLogin();
});


// =====================================================
// ADICIONAR MENSAGEM
// =====================================================

function adicionarMensagem(
  texto,
  tipo = "assistant"
) {

  const div =
    document.createElement("div");

  div.className =
    `message ${
      tipo === "user"
        ? "user-message"
        : "assistant-message"
    }`;

  const nome =
    tipo === "user"
      ? `👤 ${username || "Você"}`
      : "🤖 ZAK";

  div.innerHTML = `
    <div class="message-name">
      ${nome}
    </div>

    <div class="message-text"></div>
  `;

  const textoDiv =
    div.querySelector(".message-text");

  textoDiv.textContent = texto;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;
}


// =====================================================
// ZAK PENSANDO
// =====================================================

function mostrarTyping() {
  typing.classList.remove("hidden");

  messages.scrollTop =
    messages.scrollHeight;
}

function esconderTyping() {
  typing.classList.add("hidden");
}


// =====================================================
// ENVIAR MENSAGEM AO ZAK
// =====================================================

async function conversarComZak(texto) {

  if (!token) {
    mostrarLogin();
    return;
  }

  historico.push({
    role: "user",
    content: texto
  });

  mostrarTyping();

  try {

    const response = await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
          messages: historico,
          mode: modoAtual,
          web_search: pesquisaWeb
        })
      }
    );

    const data =
      await response.json();

    if (response.status === 401) {

      localStorage.removeItem("zak_token");
      localStorage.removeItem("zak_username");

      token = null;
      username = null;

      esconderTyping();
      mostrarLogin();

      return;
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
        "O servidor não conseguiu responder."
      );
    }

    const resposta =
      data.reply ||
      "Não consegui responder agora.";

    historico.push({
      role: "assistant",
      content: resposta
    });

    esconderTyping();

    adicionarMensagem(
      resposta,
      "assistant"
    );

  } catch (error) {

    console.error(
      "ERRO AO CONVERSAR COM ZAK:",
      error
    );

    esconderTyping();

    adicionarMensagem(
      "⚠️ Não consegui falar com o cérebro do ZAK agora.",
      "assistant"
    );
  }
}


// =====================================================
// CHAT
// =====================================================

chat.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const texto =
      input.value.trim();

    if (!texto) return;

    input.value = "";

    adicionarMensagem(
      texto,
      "user"
    );

    await conversarComZak(texto);
  }
);


// =====================================================
// MODOS
// =====================================================

modeButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      modeButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      modoAtual =
        button.dataset.mode;

      input.focus();
    }
  );

});


// =====================================================
// PESQUISA WEB
// =====================================================

webSearchButton.addEventListener(
  "click",
  () => {

    pesquisaWeb =
      !pesquisaWeb;

    webSearchButton.classList.toggle(
      "active",
      pesquisaWeb
    );

    if (pesquisaWeb) {

      webSearchButton.textContent =
        "🌐 Pesquisa na web: ON";

    } else {

      webSearchButton.textContent =
        "🌐 Pesquisa na web";
    }

    input.focus();
  }
);


// =====================================================
// LIMPAR CONVERSA
// =====================================================

clearChat.addEventListener(
  "click",
  () => {

    historico = [];

    messages.innerHTML = "";

    adicionarMensagem(
      "Conversa limpa. 😎 Bora começar de novo!",
      "assistant"
    );

    input.focus();
  }
);


// =====================================================
// ATALHOS
// =====================================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      if (!appScreen.classList.contains("hidden")) {
        input.focus();
      }
    }

  }
);


// =====================================================
// INICIAR
// =====================================================

verificarSessao();

console.log(
  "🤖 ZAK iniciado."
);

console.log(
  "👑 Criador: IsaacGamer18Sonic"
);

console.log(
  "🧠 Lore: ChatGPT é a 'mãe' do ZAK."
);
