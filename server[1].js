const http=require("http"),fs=require("fs"),path=require("path"),crypto=require("crypto");
const PORT=process.env.PORT||3000,PASSWORD=process.env.ISAAC_AI_PASSWORD||"KINGGAMER123",sessions=new Map();
function ck(r){let o={};for(let p of(r.headers.cookie||"").split(";")){let i=p.indexOf("=");if(i>0)o[p.slice(0,i).trim()]=p.slice(i+1).trim()}return o}
function ok(r){let s=ck(r).sid;return s&&sessions.has(s)}
function send(r,s,b,h={}){r.writeHead(s,{"Content-Type":"application/json; charset=utf-8",...h});r.end(JSON.stringify(b))}
function read(r){return new Promise((a,b)=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>{try{a(JSON.parse(d||"{}"))}catch(e){b(e)}})})}
function zak(m){let x=m.toLowerCase();if(/perigo|invad|senha|golpe/.test(x))return"Beleza, sem zoeira agora. Vamos resolver isso com calma e segurança. 🔒";if(/jogo|game/.test(x))return"KKKK bora 😎🎮. Me fala o estilo do jogo e eu começo a montar a ideia.";if(/site/.test(x))return"Fechou 🌐. Me diz o que o site precisa fazer e bora construir.";return`KKKK entendi 😎. Você disse: "${m.slice(0,180)}". Bora!`}
http.createServer(async(req,res)=>{
 if(req.url==="/api/login"&&req.method==="POST"){let b=await read(req);if(b.password!==PASSWORD)return send(res,401,{ok:false,error:"Senha incorreta."});let s=crypto.randomBytes(24).toString("hex");sessions.set(s,1);return send(res,200,{ok:true},{"Set-Cookie":`sid=${s}; HttpOnly; Path=/; SameSite=Strict`})}
 if(req.url==="/api/me")return send(res,200,{authenticated:!!ok(req)});
 if(req.url==="/api/chat"&&req.method==="POST"){if(!ok(req))return send(res,401,{error:"Faça login."});let b=await read(req);return send(res,200,{reply:zak(String(b.message||""))})}
 let f=req.url==="/"?"index.html":req.url.slice(1);let p=path.join(__dirname,"public",path.normalize(f));if(!p.startsWith(path.join(__dirname,"public")))return res.end("Forbidden");fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);return res.end("Não encontrado")}let t=p.endsWith(".css")?"text/css":p.endsWith(".js")?"text/javascript":"text/html";res.writeHead(200,{"Content-Type":t+"; charset=utf-8"});res.end(d)})}).listen(PORT,()=>console.log("ISAAC AI em http://localhost:"+PORT));