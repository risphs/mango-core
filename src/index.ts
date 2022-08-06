const http = require('http');
const express = require('express');
const webSocket = require('ws');

const app = express()
let port = 8080;

const server = http.createServer(app);
const webSocketServer = new webSocket.Server({ server: server });

webSocketServer.on('connection', (webSocket: any) => {
    webSocket.send('Connected to the webSocket server');

    webSocket.on('message', function incoming(message: any) {
        webSocketServer.clients.forEach((client: any) => {
            // Filter the JSON data here
            if (client !== webSocket && client.readyState === webSocket.OPEN) {
                // Send a response based on the JSON data
                client.send('this is a test and will in the future be a response')
            }
        })
    })

})

app.get('/', (req: any, res: any) => res.send('Hello World!'))

server.listen(port, () => console.log(`Server listening on port ${port}`))
