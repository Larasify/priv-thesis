const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const RunningPanorama = [];


app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/api/generatepanorama2", (req, res) => {
      const id = { id: req.body.id };
      RunningPanorama.push(id);
      console.log("Running: "+RunningPanorama);
      const actualPage = "/api/generatepanorama";
      app.render(req, res, actualPage);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
