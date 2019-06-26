const express = require("express");
const path = require("path");
const app = express();
const gameRoutes = require("./routes/game");

app.listen(3000, () => {
  console.log("Servers is listening at http://localhost:3000");
});

app.use(express.static(path.join(__dirname)));

gameRoutes(app);