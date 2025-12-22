require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const indexRouter = require("./routes/index");

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.LOCAL_DB_ADDRESS;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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

  try {
    if (session?.inTransaction?.()) {
      await session.abortTransaction();
    }
  } catch (_) {
    // ignore
  } finally {
    if (session) {
      await session.endSession().catch(() => {});
    }
    req.dbSession = null;
  }

  const status = err.statusCode || 500;
  return res.status(status).json({ error: err.message || "Server Error" });
});

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log("DB connection fail", e));

app.get("/", (req, res) => {
  res.json({ message: "Growithm Express 서버 동작 중 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
