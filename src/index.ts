const osUtil = require('os-utils')
const http = require('http');
const express = require('express');
const webSocket = require('ws');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const app = express()
let port: Number = 8000;

const server = http.createServer(app);
const webSocketServer = new webSocket.Server({ server: server });

let response: String = null; // Responses will be strigified JSON objects

interface socketResponseLayout {
    header: String,
    body: String
}


webSocketServer.on('connection', function connection(webSocket) {
    console.log('A user has connected to the WebSocket Server');

    webSocket.on('message', function incoming(message: String) { // Incoming
        webSocketServer.clients.forEach(function each(client) {
            if (client !== webSocket && client.readyState === webSocket.OPEN) {
                client.send(`${message}`);
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

socket.addEventListener('message', function (event) {
    const incoming: socketResponseLayout = JSON.parse(event.data);
    incomingChecks(incoming);
});

const sendMessage = (message: String) => {
    console.log("Sending Message: " + message)
    socket.send(message);
}

/* Ideas for the future
SYSTEM-VIEW-LOGS ~ KEEP IN MIND IDEA OF LOGS
*/

// let commandOutput;

// async function executeCommand(command: String) {
//     const execution = await exec(command);
//     commandOutput = execution.stdout;
// }

async function incomingChecks(input: socketResponseLayout) {
    if(input.header === 'CONSOLE-RUN') {
        const execution = await exec(input.body);

        const sendingForm: socketResponseLayout = { header: 'CONSOLE-INFORMATION', body: execution.stdout };
        sendMessage(JSON.stringify(sendingForm))

    } else if(input.header === 'SYSTEM-TOTAL-MEMORY') {
        const osUtilString: String = osUtil.totalmem().toString();
        const sendingForm: socketResponseLayout = { header: 'SYSTEM-TOTAL-MEMORY-NUMBER', body: osUtilString }
        const message = JSON.stringify(sendingForm);
        sendMessage(message);
    } else if(input.header === 'SYSTEM-USED-MEMORY') {
        const sendingForm: socketResponseLayout = { header: 'SYSTEM-USED-MEMORY-NUMBER', body: `${osUtil.totalmem() - osUtil.freemem()}` }
        sendMessage(JSON.stringify(sendingForm))
    } else if(input.header === 'SYSTEM-REGISTERED-PROGRAM') {

    } else if(input.header === 'SYSTEM-RESTART') {

    } else if(input.header === 'SYSTEM-SHUTDOWN') {

    } else if(input.header === 'CURRENT-INCOMING-TRAFFIC') {

    } else if(input.header === 'FREE-MEMORY') {
        const sendingForm: socketResponseLayout = { header: 'FREE-MEMORY-NUMBER', body: osUtil.freemem() }
        sendMessage(JSON.stringify(sendingForm))
    } else if(input.header === 'CURRENT-CPU-USAGE') {
        const sendingForm: socketResponseLayout = { header: 'CURRENT-CPU-USAGE-NUMBER', body: osUtil.cpuUsage() }
        sendMessage(JSON.stringify(sendingForm))
    } else {
        return console.log('Invalid header: ', input.header);
    }
}