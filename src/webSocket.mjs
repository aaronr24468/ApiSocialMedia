import { WebSocketServer } from "ws";

export const webSocket = () => {
    const wss = new WebSocketServer({ port: 8181 });
    const connections = {};
    let imageConnection = {}

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            //console.log(data, "dawdaw")
            let msg;

            switch (data.type) {
                case "join":
                    connections[data.name] = ws;
                    imageConnection[data.name] = data.image 
                    msg = JSON.stringify({
                        "type": 'join',
                        "names": Object.values(connections),
                        "imageUsers": imageConnection
                    })
                    Object.values(connections).forEach((connection) => {
                        connection.send() && connection.send(msg)
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
                        "type": "logout",
                        "names": Object.values(connections),
                        "imageUsers": imageConnection
                    })
                    Object.values(connections).forEach((connection) =>{
                        connection.send() && connection.send(msg)
                    })
                    break;
            }
        })
    })
}