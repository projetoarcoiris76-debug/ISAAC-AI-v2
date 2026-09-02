const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPassword.textContent = "◉";
  } else {
    passwordInput.type = "password";
    showPassword.textContent = "◉";
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const senha = passwordInput.value;

  /*
    IMPORTANTE:
    Coloque aqui a senha que você escolheu.
    Esta versão é apenas para o protótipo do GitHub Pages.
  */
 const SENHA_CORRETA = "KINGGAMER123";

  if (senha === SENHA_CORRETA) {
    error.textContent = "";

    // Esconde o login
    document.getElementById("login").classList.add("hidden");

    // Mostra o aplicativo
    document.getElementById("app").classList.remove("hidden");
  } else {
    error.textContent = "❌ Senha incorreta!";
  }
});
