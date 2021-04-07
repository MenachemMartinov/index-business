const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");
const app = express();

// connected to Mongo DB
mongoose
  .connect(config.get("mongo"), {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => console.log(`connected to mongo`))
  .catch((error) => console.error("Filed: could not connect to mongo", error));

// use deferent a PORT
app.use(cors());
// allows to use JSON information
app.use(express.json());
/***
 * this is static path
 */
// this is static path to frontEnd of the site
app.use(express.static(process.cwd() + "/build"));
// this is static path to get to the files
app.use("/upload", express.static(path.relative(__dirname, "upload")));

/***
 * this all endPint
 */
app.use("/api/users", require("./routes/users.route"));
app.use("/api/messages", require("./routes/message.route"));
app.use("/api/cards", require("./routes/cards.route"));
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/files", require("./routes/files.route"));
app.use("/api/favorites", require("./routes/favorites.route"));

// this is if all other endPint is no relevant this catches it
app.get("*", (req, res) => {
  res.sendFile(process.cwd() + "/build/index.html");
});

// this is the port what the server run
const PORT = process.env.PORT || 3007;

app.listen(PORT, () => console.log(`click http://localhost:${PORT}`));
