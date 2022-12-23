require('dotenv').config();

const port = 8080;
const graceDelaySeconds = process.env.GRACE_DELAY_SECONDS || 10;
const express = require("express");
const actuator = require('express-actuator');


app = express();  
app.use(actuator());

app.get("/", (req, res) => {
  res.send("Hello, Universe!");
});

app.get("/shutdown", (req, res) => {
    counter();
});

let server = app.listen(port, () => {
  console.log(`The Express.js server has started and is listening
  on port number: ${port}`);
  console.log(`Using app grace delay loop ${graceDelaySeconds} seconds.`);
});

const gracefulShutdown = () => {
    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
    server.close(() => {
        console.log('Closed out remaining connections.')
        process.exit()
    })
    setTimeout(() => {
       console.error('Deay for %ds, Could not close connections in time, forcefully shutting down',graceDelaySeconds)
       process.exit()
    }, graceDelaySeconds * 1000)
 }

 // listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown)
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)

function counter() {
    let count = 0
    setInterval(() => {
      count++;
      console.log(count)
    }, 1000)
}