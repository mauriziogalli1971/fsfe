const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => {console.log(`Server started on port 3000`)});

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({server: server});

wss.on('connection', function connection (ws) {
   const numClients = wss.clients.size;
   console.log(`Clients connected: ${numClients}`);

    wss.broadcast(`Current visitors: ${numClients}`);

   if (wss.readyState === wss.OPEN) {
       console.log(`Welcome to my server!`);
       wss.broadcast(`Welcome to my server!`);
   }

    wss.on('close', function close() {
       console.log(`A client has disconnected!`);
        wss.broadcast(`A client has disconnected!`);
   });
});

wss.broadcast = function broadcast (data) {
    this.clients.forEach(client => {
        client.send(data);
    })
};