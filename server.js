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

// allows to use JSON information
app.use(express.json());
// app.use(bodyParser.urlencoded());

app.use(express.static(process.cwd() + "/build"));

app.use("/api/users", require("./routes/users.route"));
app.use("/api/messages", require("./routes/message.route"));
app.use("/api/cards", require("./routes/cards.route"));
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/files", require("./routes/files.route"));

app.get("*", (req, res) => {
  res.sendFile(process.cwd() + "/build/index.html");
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`click http://localhost:${PORT}`));
