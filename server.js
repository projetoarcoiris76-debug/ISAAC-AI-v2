const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const SITE_PASSWORD = process.env.SITE_PASSWORD || "troque-esta-senha";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/login", (req, res) => {
  const { password } = req.body || {};
  if (password !== SITE_PASSWORD) return res.status(401).json({ok:false, message:"Senha incorreta."});
  res.json({ok:true});
});

app.listen(PORT, () => console.log("ISAAC AI em http://localhost:" + PORT));
