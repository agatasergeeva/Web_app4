import express from "express";
import multer from "multer";
import zlib from "zlib";

const app = express();

const LOGIN = "agata_86";

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/login", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.end(LOGIN);
});

app.post("/zipper", upload.any(), (req, res) => {
  const files = req.files || [];

  if (files.length === 0) {
    res.status(400);
    res.setHeader("Content-Type", "text/plain; charset=UTF-8");
    return res.end("No file uploaded");
  }

  const sourceBuffer = files[0].buffer;
  const compressedBuffer = zlib.gzipSync(sourceBuffer);

  res.status(200);
  res.setHeader("Content-Type", "application/gzip");
  res.setHeader("Content-Disposition", "attachment; filename=result.gz");
  res.end(compressedBuffer);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT);