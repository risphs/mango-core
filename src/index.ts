const http = require('http');
const express = require('express');
const webSocket = require('ws');

const app = express()
let port: Number = 8000;

const server = http.createServer(app);
const webSocketServer = new webSocket.Server({ server: server });

let response: String = null; // Responses will be strigified JSON objects

interface socketResponseLayout {
    header: String,
    body: String
}

webSocketServer.on('connection', (webSocket: any) => {
    webSocket.send('Connected to the WebSocket server');

    webSocket.on('message', function incoming(message: string) { // Incoming
        webSocketServer.clients.forEach((client: any) => {
            if (client !== webSocket && client.readyState === webSocket.OPEN) {
                client.send(message)
            }
        })
    })

})

app.get('/', (req: any, res: any) => res.send('Hello World'))

server.listen(port, () => console.log(`Server listening on port ${port}`))

// WebSocket Connection

const webSocketPort: Number = 8000;
const webSocketIP: String = 'localhost';

const socket = new webSocket(`ws://${webSocketIP}:${webSocketPort}`);

socket.addEventListener('close', function (event: any) {
    console.log("Disconnected from the WebSocket");
});

socket.addEventListener('error', function (event: any) {
    console.log("Client Error: ", event);
});

socket.addEventListener('message', function (event: string) {
    incomingChecks(JSON.parse(event));
});

const sendMessage = (message: string) => {
    socket.send(message);
}

/* Ideas for the future
SYSTEM-VIEW-LOGS ~ KEEP IN MIND IDEA OF LOGS
*/



export function incomingChecks(input: socketResponseLayout) {
    if(input.header === 'CONSOLE-RUN') {

    } else if(input.header === 'CONSOLE-GET-TEXT') {

    } else if(input.header === 'SYSTEM-TOTAL-MEMORY') {

    } else if(input.header === 'SYSTEM-USED-MEMORY') {

    } else if(input.header === 'SYSTEM-REGISTERED-PROGRAM') {

    } else if(input.header === 'SYSTEM-RESTART') {

    } else if(input.header === 'SYSTEM-SHUTDOWN') {

    } else if(input.header === 'CURRENT-INCOMING-TRAFFIC') {

    } else if(input.header === 'CURRENT-MEMORY-USAGE') {

    } else if(input.header === 'CURRENT-CPU-USAGE') {

    }
}