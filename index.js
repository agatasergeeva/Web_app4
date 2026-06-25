import express from "express";
import multer from "multer";
import mongoose from "mongoose";

const app = express();

const LOGIN = "agata_86";

const upload = multer({
  storage: multer.memoryStorage()
});

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept,x-test,ngrok-skip-browser-warning,Access-Control-Allow-Headers"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).send("");
  }

  next();
});

function getPngSize(buffer) {
  const isPng =
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  if (!isPng) {
    throw new Error("File is not PNG");
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  return {
    width,
    height
  };
}

app.get("/", (req, res) => {
  res.type("text/plain").send("Server is working");
});

app.get("/login/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.send(LOGIN);
});

app.post("/size2json/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Field image is required"
      });
    }

    const size = getPngSize(req.file.buffer);

    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        width: size.width,
        height: size.height
      })
    );
  } catch (error) {
    res.status(400).json({
      error: "Invalid PNG image"
    });
  }
});

app.post("/insert/", async (req, res) => {
  let connection;

  try {
    const { login, password, URL } = req.body;

    if (!login || !password || !URL) {
      return res.status(400).json({
        error: "Fields login, password and URL are required"
      });
    }

    connection = await mongoose.createConnection(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const userSchema = new mongoose.Schema(
      {
        login: String,
        password: String
      },
      {
        collection: "users"
      }
    );

    const User = connection.model("User", userSchema);

    await User.create({
      login,
      password
    });

    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        message: "inserted",
        login
      })
    );
  } catch (error) {
    res.status(500).json({
      error: "Database insert error"
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});