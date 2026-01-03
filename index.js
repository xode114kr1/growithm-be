require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const indexRouter = require("./routes/index");

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.LOCAL_DB_ADDRESS;
const app = express();

app.set("trust proxy", 1);

const allow = new Set([
  "https://growithm.netlify.app",
  "http://localhost:5173",
]);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      cb(null, allow.has(origin));
    },
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api", indexRouter);

app.use(async (err, req, res, next) => {
  const session = req.dbSession;
  console.log(err);
  try {
    if (session?.inTransaction?.()) {
      await session.abortTransaction();
    }
  } catch (_) {
  } finally {
    if (session) {
      await session.endSession().catch(() => {});
    }
    req.dbSession = null;
  }

  const status = err.status || 500;

  return res.status(status).json({ error: err.message || "Server Error" });
});

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log("DB connection fail", e));

app.get("/", (req, res) => {
  res.json({ message: "Growithm Express 서버 동작 중 🚀" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
