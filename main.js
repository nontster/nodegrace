require('dotenv').config();

const port = 8080;
const graceDelaySeconds = process.env.GRACE_DELAY_SECONDS || 10;
const express = require("express");
const actuator = require('express-actuator');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  app = express();
  app.use(actuator());

  app.get("/", (req, res) => {
    res.send('ok')
  });

  app.get("/shutdown", async (req, res) => {
    console.log('start counter');

    try {
      await counter()
    } catch (error) {
      return next(error);
    }

    console.info('Simulate graceful shutdown by delay for %ds', graceDelaySeconds);
    await waitforme(graceDelaySeconds * 1000);

    res.send("end shutdown");
  });

  let server = app.listen(port, () => {
    console.log(`The Express.js server has started and is listening on port number: ${port}`);
  });

  const gracefulShutdown = () => {
    console.info('Got SIGTERM. graceful shutdown start', new Date().toISOString());
    server.close(() => {
      console.log('Closed out remaining connections.');
      process.exit();
    });
  }

  // listen for TERM signal .e.g. kill
  process.on('SIGTERM', gracefulShutdown)
  // listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', gracefulShutdown)

  async function counter() {
    let count = 0;
    setInterval(() => {
      count++;
      console.log(count);
    }, 1000);
  }

  function waitforme(millisec) {
    return new Promise(resolve => {
      setTimeout(() => { resolve('') }, millisec);
    })
  }
}