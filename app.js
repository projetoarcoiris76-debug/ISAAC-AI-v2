const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showPassword.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        showPassword.textContent = "👁️";
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const senha = passwordInput.value;

    // SENHA DO SITE
    const SENHA_CORRETA = "NEWULTRA13";

    if (senha === SENHA_CORRETA) {
        error.textContent = "";

        document.getElementById("login").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");

    } else {
        error.textContent = "❌ Senha incorreta!";
    }
});
