const express = require("express");
const routes = require("../routes");

const app = express();

// Routes
app.use("/", routes);

// PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[User Backend] Listen on port ${PORT}`);
});