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
  let sourceBuffer = Buffer.from("");

  if (req.files && req.files.length > 0) {
    sourceBuffer = req.files[0].buffer;
  } else if (req.body && Object.keys(req.body).length > 0) {
    const firstValue = Object.values(req.body)[0];
    sourceBuffer = Buffer.from(String(firstValue));
  }

  const compressed = zlib.gzipSync(sourceBuffer);

  res.setHeader("Content-Type", "application/gzip");
  res.setHeader("Content-Disposition", 'attachment; filename="result.gz"');
  res.send(compressed);
});

app.get("/zipper", (req, res) => {
  res.type("text/html").send(`
    <form method="POST" action="/zipper" enctype="multipart/form-data">
      <input type="file" name="file">
      <button type="submit">Upload</button>
    </form>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT);