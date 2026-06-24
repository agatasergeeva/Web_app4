import express from "express";

const app = express();

const LOGIN = "agata_86";

app.get("/", (req, res) => {
  res.type("text/plain").send("Web application is running");
});

app.get("/login", (req, res) => {
  res.type("text/plain").send(LOGIN);
});

app.get("/id/:N", async (req, res) => {
  try {
    const N = req.params.N;

    const response = await fetch(`https://nd.kodaktor.ru/users/${N}`, {
      method: "GET"
    });

    const data = await response.json();

    res.type("text/plain").send(data.login);
  } catch (error) {
    res.status(500).type("text/plain").send("Error");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});