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
      return res.status(400).type("text/plain").send("File is required");
    }

    const file = req.files[0];

    zlib.gzip(file.buffer, (error, compressedBuffer) => {
      if (error) {
        return res.status(500).type("text/plain").send("Gzip error");
      }

      res.setHeader("Content-Type", "application/gzip");
      res.setHeader("Content-Disposition", "attachment; filename=\"result.gz\"");
      res.send(compressedBuffer);
    });
  } catch (error) {
    res.status(500).type("text/plain").send("Server error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});