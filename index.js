import express from "express";
import cors from "cors";
import busboy from "busboy";
import zlib from "zlib";

const app = express();

const LOGIN = "agata_86";

app.use(cors());

app.get("/login", (req, res) => {
  res
    .status(200)
    .type("text/plain")
    .send(LOGIN);
});

app.post("/zipper", (req, res) => {
  const formParser = busboy({
    headers: req.headers
  });

  const parts = [];

  formParser.on("file", (fieldName, fileStream) => {
    fileStream.on("data", (chunk) => {
      parts.push(chunk);
    });
  });

  formParser.on("field", (fieldName, value) => {
    parts.push(Buffer.from(value));
  });

  formParser.on("error", () => {
    res
      .status(400)
      .type("text/plain")
      .end("Bad multipart data");
  });

  formParser.on("finish", () => {
    const source = Buffer.concat(parts);
    const compressed = zlib.gzipSync(source);

    res
      .status(200)
      .set("Content-Type", "application/gzip")
      .set("Content-Disposition", 'attachment; filename="result.gz"')
      .end(compressed);
  });

  req.pipe(formParser);
});

const PORT = process.env.PORT;

app.listen(PORT);