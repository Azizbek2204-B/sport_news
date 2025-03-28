const express = require("express");
const config = require("config");
const mongoose = require('mongoose');
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser"); 
const exHbs = require("express-handlebars");
const viewRouter = require("./routes/view.routes");
const PORT = config.get("port") || 3030;
const createTables = require("./config/create-tables");
const app = express();

app.use(cookieParser());
app.use(express.json());
const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));

app.use("/", viewRouter);
app.use("/api", mainRouter);

app.get("/create-tables", async (req, res) => {
  await createTables();
  console.log("Tables were created");
  res.status(200).send("created");
});

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();