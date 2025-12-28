import { WebSocketServer } from "ws";
// import {config} from 'dotenv';
// config();

export const webSocket = (server) => {
    const wss = new WebSocketServer({ server }); //puerto no puede ser el mismo que el puerto de la api en si
    const connections = {};
    let imageConnection = {}

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            //console.log(data)
            let msg;

            switch (data.type) {
                case "join":
                    connections[data.name] = ws;
                    imageConnection[data.name] = data.image
                    msg = JSON.stringify({
                        "type": 'join',
                        "names": Object.keys(connections),
                        "imageUsers": imageConnection
                    })
                    Object.values(connections).forEach((connection) => {
                        connection.send && connection.send(msg)
                    })
                    break;

                case "msg":
                    if (data.recieve.length > 0) {
                        connections[data.name].send(msg = JSON.stringify({
                            "type": 'msg',
                            "name": data.name,
                            "msg": data.msg
                        }))
                        connections[data.recieve].send(msg = JSON.stringify({
                            "type": 'msg',
                            "name": data.name,
                            "msg": data.msg
                        }))

                    }
                    break;

                case 'logout':
                    delete connections[data.name]
                    delete imageConnection[data.name]
                    msg = JSON.stringify({
                        "type": "join",
                        "names": Object.keys(connections),
                        "imageUsers": imageConnection
                    })
                    Object.values(connections).forEach((connection) => {
                        connection.send && connection.send(msg)
                    })
                    break;
            }
        })
    })
}