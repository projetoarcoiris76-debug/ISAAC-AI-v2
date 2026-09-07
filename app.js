const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("click", () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const senha = passwordInput.value;

  // Use aqui a senha que você configurou
  const SENHA_CORRETA = "NEWULTRA13";

  if (senha === SENHA_CORRETA) {
    error.textContent = "";

    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  } else {
    error.textContent = "❌ Senha incorreta!";
  }
});


// ===============================
// CHAT DO ZAK
// ===============================

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

chat.addEventListener("submit", (event) => {
  event.preventDefault();

  const texto = input.value.trim();

  if (texto === "") return;

  // Mensagem do usuário
  const mensagemUsuario = document.createElement("div");
  mensagemUsuario.className = "msg user";
  mensagemUsuario.textContent = texto;

  messages.appendChild(mensagemUsuario);

  input.value = "";
  input.focus();

  // Resposta do ZAK
  setTimeout(() => {
    const resposta = document.createElement("div");
    resposta.className = "msg";

    resposta.textContent =
      "🤖 ZAK: Recebi sua mensagem! 😎 Ainda estou aprendendo, mas o sistema de conversa já está funcionando!";

    messages.appendChild(resposta);

    messages.scrollTop = messages.scrollHeight;
  }, 500);

  messages.scrollTop = messages.scrollHeight;
});
