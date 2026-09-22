/* =========================================
   ZAK - SISTEMA DE LOGIN
========================================= */


/*
   🔐 COLOQUE A SUA SENHA AQUI

   NÃO PRECISA ME ENVIAR A SENHA.
*/
const SENHA_CORRETA = "kinggamer123";


const passwordInput = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const loginError = document.getElementById("login-error");
const showPassword = document.getElementById("show-password");


/* =========================================
   MOSTRAR / ESCONDER SENHA
========================================= */

showPassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        showPassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        showPassword.textContent = "👁️";

    }

});


/* =========================================
   FUNÇÃO DE LOGIN
========================================= */

function fazerLogin() {

    const senhaDigitada = passwordInput.value;


    if (senhaDigitada === SENHA_CORRETA) {

        // Login correto
        document.body.classList.add("logged-in");

        loginError.style.display = "none";

        passwordInput.value = "";

    } else {

        // Senha errada
        loginError.textContent =
            "❌ Senha incorreta. Acesso negado.";

        loginError.style.display = "block";

        passwordInput.value = "";

        passwordInput.focus();
    }
}


/* =========================================
   BOTÃO ENTRAR
========================================= */

loginButton.addEventListener("click", fazerLogin);


/* =========================================
   ENTER TAMBÉM FAZ LOGIN
========================================= */

passwordInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        fazerLogin();

    }

});
