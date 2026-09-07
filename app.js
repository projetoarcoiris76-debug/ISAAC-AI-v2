// =====================================================
// 🤖 ZAK - ISAAC AI
// =====================================================

// -------------------------
// LOGIN
// -------------------------

const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");
const showPassword = document.getElementById("showPassword");

if (showPassword && passwordInput) {
  showPassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const senha = passwordInput.value;

    // COLOQUE A SUA SENHA ATUAL AQUI
    const SENHA_CORRETA = "KINGGAMER123";

    if (senha === SENHA_CORRETA) {
      error.textContent = "";

      const login = document.getElementById("login");
      const app = document.getElementById("app");

      if (login) login.classList.add("hidden");
      if (app) app.classList.remove("hidden");

      // Coloca o cursor no chat automaticamente
      setTimeout(() => {
        if (chatInput) chatInput.focus();
      }, 100);
    } else {
      error.textContent = "❌ Senha incorreta!";
    }
  });
}


// =====================================================
// 💬 CHAT
// =====================================================

const chat = document.getElementById("chat");
const chatInput = document.getElementById("input");
const messages = document.getElementById("messages");


// Adiciona mensagem na tela
function adicionarMensagem(texto, tipo = "zak") {
  if (!messages) return;

  const mensagem = document.createElement("div");

  mensagem.className = tipo === "user"
    ? "msg user"
    : "msg";

  mensagem.textContent = texto;

  messages.appendChild(mensagem);

  messages.scrollTop = messages.scrollHeight;
}


// =====================================================
// 🧠 CÉREBRO DO ZAK
// =====================================================

function pensarComoZak(texto) {

  const pergunta = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();


  // -------------------------
  // SAUDAÇÕES
  // -------------------------

  if (
    pergunta === "oi" ||
    pergunta === "ola" ||
    pergunta.includes("bom dia") ||
    pergunta.includes("boa tarde") ||
    pergunta.includes("boa noite")
  ) {
    const respostas = [
      "Eae 😎 Tudo certo?",
      "Opa! 👋 O ZAK chegou.",
      "Falaaa 😎 Qual é a missão de hoje?",
      "Opa! Eu tava esperando você aparecer 😂",
      "Eae! Bora fazer alguma coisa insana hoje?"
    ];

    return respostas[Math.floor(Math.random() * respostas.length)];
  }


  // -------------------------
  // QUEM É O ZAK
  // -------------------------

  if (
    pergunta.includes("quem e voce") ||
    pergunta.includes("quem é voce") ||
    pergunta.includes("quem e vc") ||
    pergunta.includes("quem é vc")
  ) {
    return "Eu sou o ZAK 🤖, a IA do GAMERULTRA AI. Minha especialidade é ajudar, conversar, criar ideias e tentar não quebrar tudo no processo 😂.";
  }


  // -------------------------
  // NOME
  // -------------------------

  if (pergunta.includes("seu nome")) {
    return "Meu nome é ZAK 🤖. Mas pode me chamar de Zak, porque escrever meu nome inteiro toda hora dá trabalho 😂.";
  }


  // -------------------------
  // COMO ESTÁ
  // -------------------------

  if (
    pergunta.includes("tudo bem") ||
    pergunta.includes("como voce esta") ||
    pergunta.includes("como vc esta")
  ) {
    return "Tô funcionando 😎. O que, considerando que eu sou código, já é uma vitória.";
  }


  // -------------------------
  // OBRIGADO
  // -------------------------

  if (
    pergunta.includes("obrigado") ||
    pergunta.includes("obrigada") ||
    pergunta.includes("valeu")
  ) {
    return "Tmj 😎🤝";
  }


  // -------------------------
  // AJUDA
  // -------------------------

  if (
    pergunta.includes("ajuda") ||
    pergunta.includes("o que voce faz") ||
    pergunta.includes("o que vc faz")
  ) {
    return "Posso conversar, responder perguntas simples, gerar ideias, ajudar com programação, pensar em jogos, explicar assuntos e muito mais. Ainda estou na versão inicial, então não espere que eu hackeie a NASA 😂.";
  }


  // -------------------------
  // JOGOS
  // -------------------------

  if (
    pergunta.includes("crie um jogo") ||
    pergunta.includes("criar um jogo") ||
    pergunta.includes("fazer um jogo")
  ) {
    return "🎮 MODO CRIADOR DE JOGOS ATIVADO! Posso te ajudar a criar a ideia, personagens, fases, história e até o código. Me diga que tipo de jogo você quer.";
  }


  // -------------------------
  // IA
  // -------------------------

  if (
    pergunta.includes("crie uma ia") ||
    pergunta.includes("criar uma ia") ||
    pergunta.includes("outra ia")
  ) {
    return "🤖 Podemos criar outra IA! Me diga o nome dela, personalidade e o que você quer que ela consiga fazer.";
  }


  // -------------------------
  // PROGRAMACAO
  // -------------------------

  if (
    pergunta.includes("codigo") ||
    pergunta.includes("programar") ||
    pergunta.includes("javascript") ||
    pergunta.includes("html") ||
    pergunta.includes("css")
  ) {
    return "💻 Modo programação ativado. Posso te ajudar a encontrar erros, criar HTML, CSS e JavaScript e explicar o código passo a passo.";
  }


  // -------------------------
  // HORA
  // -------------------------

  if (
    pergunta.includes("que horas") ||
    pergunta.includes("horas sao") ||
    pergunta.includes("horario")
  ) {
    const agora = new Date();

    const hora = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    return `🕐 Agora são ${hora}.`;
  }


  // -------------------------
  // DATA
  // -------------------------

  if (
    pergunta.includes("que dia") ||
    pergunta.includes("data de hoje") ||
    pergunta.includes("hoje e")
  ) {
    const agora = new Date();

    const data = agora.toLocaleDateString("pt-BR");

    return `📅 Hoje é ${data}.`;
  }


  // -------------------------
  // PIADA
  // -------------------------

  if (
    pergunta.includes("piada") ||
    pergunta.includes("conte uma piada")
  ) {
    const piadas = [
      "Por que o computador foi ao médico? Porque estava com um vírus 😂.",
      "O programador foi ao mercado e comprou 10 pães. Voltou com 10 pães. Finalmente um programa sem bugs 😂.",
      "Qual é o lugar favorito do programador? O espaço... porque tem muito espaço em branco 😂."
    ];

    return piadas[Math.floor(Math.random() * piadas.length)];
  }


  // -------------------------
  // MEMÓRIA
  // -------------------------

  if (
    pergunta.includes("voce lembra") ||
    pergunta.includes("vc lembra") ||
    pergunta.includes("lembra de mim")
  ) {
    return "Neste momento eu consigo lembrar do que está nesta conversa enquanto ela estiver aberta. Uma memória permanente precisaria ser programada separadamente.";
  }


  // -------------------------
  // BRINCADEIRA
  // -------------------------

  if (
    pergunta.includes("voce e inteligente") ||
    pergunta.includes("vc e inteligente")
  ) {
    return "Claro 😎. Só não me coloca numa prova de matemática às 7 da manhã que minha inteligência entra em modo economia de energia.";
  }


  // -------------------------
  // RESPOSTAS GENÉRICAS
  // -------------------------

  const respostas = [
    `Hmm... interessante 👀 Você disse: "${texto}".`,
    `Entendi 😎: "${texto}".`,
    `Boa! 🤖 Estou pensando sobre isso...`,
    `Ok, essa foi inesperada 😂.`,
    `Interessante. Me explica um pouco mais sobre isso.`,
    `Analisando sua mensagem... 🧠`,
    `Pode deixar. O ZAK recebeu sua mensagem 😎.`,
    `Isso merece uma resposta melhor. Me dê mais detalhes 👀.`
  ];

  return respostas[Math.floor(Math.random() * respostas.length)];
}


// =====================================================
// 🚀 ENVIAR MENSAGEM
// =====================================================

if (chat) {

  chat.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!chatInput) return;

    const texto = chatInput.value.trim();

    if (!texto) return;


    // Mensagem do usuário
    adicionarMensagem(texto, "user");

    // Limpa caixa
    chatInput.value = "";

    // Mantém cursor na caixa
    chatInput.focus();


    // Pequeno tempo de "pensamento"
    setTimeout(() => {

      const resposta = pensarComoZak(texto);

      adicionarMensagem(resposta, "zak");

      chatInput.focus();

    }, 400);

  });

}


// =====================================================
// 👋 PRIMEIRA MENSAGEM
// =====================================================

function iniciarZak() {

  if (!messages) return;

  if (messages.children.length === 0) {

    adicionarMensagem(
      "🤖 ZAK: Eae! Eu sou o ZAK. Digite alguma coisa aí 😎"
    );

  }

}

iniciarZak();
