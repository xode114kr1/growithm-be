const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const indexRouter = require("./routes/index");

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.LOCAL_DB_ADDRESS;
const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log("DB connection fail", e));

app.get("/", (req, res) => {
  res.json({ message: "Growithm Express 서버 동작 중 🚀" });
});

app.post("/github/webhook", (req, res) => {
  console.log("Webhook 들어옴!");
  res.sendStatus(200);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
