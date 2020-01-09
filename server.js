const express = require("express");
require('dotenv').config();
const projectRouter = require('./projects/projectRouter')
const actionRouter = require("./actions/actionRouter")
const server = express();
server.use(express.json())

//custom middleware
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )}`
  );

  next();
}

server.use("/api/projects", projectRouter)
server.use("/api/actions", actionRouter)
server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's Sprint!</h2>`);
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
