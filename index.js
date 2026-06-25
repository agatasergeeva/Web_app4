import express from "express";

const app = express();

const LOGIN = "agata_86";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.setHeader("X-Author", LOGIN);
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.send(LOGIN);
});

app.get("/login/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.send(LOGIN);
});

app.get("/sample/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.send("function task(x){ return x * this * this; }");
});

app.get("/promise/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.send("function task(x){ return x < 18 ? Promise.resolve('yes') : Promise.reject('no'); }");
});

app.get("/fetch/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=UTF-8");

  res.send(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Fetch Task</title>
</head>
<body>
  <input id="inp">
  <button id="bt">Fetch</button>

  <script>
    const inp = document.getElementById("inp");
    const bt = document.getElementById("bt");

    bt.addEventListener("click", async () => {
      const response = await fetch(inp.value);
      const text = await response.text();
      inp.value = text;
    });
  </script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});