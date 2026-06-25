import express from "express";

const app = express();

const LOGIN = "agata_86";

app.use(express.text({ type: "*/*" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers"
  );
  next();
});

function getMoscowDate() {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const parts = formatter.formatToParts(new Date());

  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

  return {
    routeDate: `${day}${month}${year.slice(2)}`,
    fullDate: `${day}-${month}-${year}`
  };
}

app.all("/result4/", (req, res) => {
  const xTest = req.get("x-test") || "";
  const body = typeof req.body === "string" ? req.body : "";

  res.setHeader("Content-Type", "application/json");

  res.send(
    JSON.stringify({
      message: LOGIN,
      "x-result": xTest,
      "x-body": body
    })
  );
});

app.get("/api/rv/:value/", (req, res) => {
  const value = req.params.value;

  if (!/^[a-z]+$/.test(value)) {
    return res.status(404).type("text/plain").send("Not found");
  }

  const reversed = value.split("").reverse().join("");

  res.type("text/plain").send(reversed);
});

function sendDateResponse(req, res) {
  const { routeDate, fullDate } = getMoscowDate();
  const dateFromRoute = req.params.date;

  if (dateFromRoute !== routeDate) {
    return res.status(404).type("text/plain").send("Not found");
  }

  res.setHeader("Content-Type", "application/json");

  res.send(
    JSON.stringify({
      date: fullDate,
      login: LOGIN
    })
  );
}

app.get("/:date", sendDateResponse);
app.get("/:date/", sendDateResponse);

app.get("/", (req, res) => {
  res.type("text/plain").send("Server is working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});