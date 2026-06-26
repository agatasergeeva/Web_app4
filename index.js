import express from "express";
import multer from "multer";
import zlib from "zlib";

const app = express();

const LOGIN = "agata_86";

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/", (req, res) => {
  res.type("text/plain").send("Server is working");
});

app.get("/login", (req, res) => {
  res.type("text/plain").send(LOGIN);
});

app.post("/zipper", upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).type("text/plain").send("No file uploaded");
    }

    const file = req.files[0];
    const compressed = zlib.gzipSync(file.buffer);

    res.setHeader("Content-Type", "application/gzip");
    res.setHeader("Content-Disposition", 'attachment; filename="result.gz"');

    res.send(compressed);
  } catch (error) {
    res.status(500).type("text/plain").send("Gzip error");
  }
});

app.get("/zipper", (req, res) => {
  res.type("text/html").send(`
    <form method="POST" action="/zipper" enctype="multipart/form-data">
      <input type="file" name="file">
      <button type="submit">Upload</button>
    </form>
  `);
});

const PORT = process.env.PORT;

app.listen(PORT);