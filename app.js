const $=id=>document.getElementById(id);
$("show").onclick=()=>{$("password").type=$("password").type==="password"?"text":"password"};
$("loginForm").onsubmit=async e=>{
 e.preventDefault();$("error").textContent="";
 try{
  const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("password").value})});
  const d=await r.json(); if(!d.ok) throw Error(d.message);
  $("login").classList.add("hidden");$("app").classList.remove("hidden");
 }catch(err){
  if(location.protocol==="file:" && $("password").value){$("login").classList.add("hidden");$("app").classList.remove("hidden");return}
  $("error").textContent=err.message||"Erro ao entrar.";
 }
};
function reply(t){t=t.toLowerCase();if(t.includes("jogo"))return"Bora criar esse jogo! 🎮 Me diga o gênero e a ideia.";if(t.includes("ia"))return"Criar outra IA? Boa 😎. Me diga o nome e a função.";if(t.includes("oi")||t.includes("ola")||t.includes("olá"))return"Falaaa! 😎 Qual é a missão?";if(t.includes("ajuda"))return"Modo sério ativado. Me explica e vamos resolver.";return"Entendi 👀. Me conta mais e eu te ajudo."}
function send(t){if(!t.trim())return;let a=document.createElement("div");a.className="msg user";a.textContent=t;$("messages").append(a);setTimeout(()=>{let b=document.createElement("div");b.className="msg";b.textContent="ZAK: "+reply(t);$("messages").append(b);$("messages").scrollTop=$("messages").scrollHeight},300)}
$("chat").onsubmit=e=>{e.preventDefault();let t=$("input").value; $("input").value="";send(t)};
document.querySelectorAll(".quick button").forEach(b=>b.onclick=()=>send(b.dataset.p));