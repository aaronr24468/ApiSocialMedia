import { WebSocketServer } from "ws";
// import {config} from 'dotenv';
// config();

export const webSocket = (server) => {
    const wss = new WebSocketServer({ server }); //puerto no puede ser el mismo que el puerto de la api en si
    const connections = {};
    let imageConnection = {}

    wss.on('connection', (ws) => { //inciamos connection con webSocketServer
        ws.on('message', (message) => { //iniciamos connection a los mensajes
            const data = JSON.parse(message); //convertimos el json que se manda a un objeto que se puede manipular con js
            //console.log(data.name)
            let msg; //creamos una variable que se llama mensaje para guardar los mensajes en JSON que se enviaran al usuario en el fron

            switch (data.type) { //depentiendo el type entrara en el case
                case "join":
                    connections[data.name] = ws; //guardamos como key el nombre de usuario y como valor el ws el cual es como la ruta de datos del usuario
                    imageConnection[data.name] = data.image // guadamos como key el nombre de usuario y como valor el url de la imagen de perfin
                    msg = JSON.stringify({ //guardamos en msg una JSON con los siguiente datos
                        "type": 'join', //le asignamos en type join, aqui decimos los usuario que se logean y aparescan en el chat
                        "names": Object.keys(connections), //con el metodo object.keys nos regresa un array con las keys de connections, mandara los nombres de todos los conectados
                        "imageUsers": imageConnection //madaremos el objeto con todas las imagenes de los usuarios conectados
                    })
                    Object.values(connections).forEach((connection) => { /*obetenmos todos los valores del connection en un array y con el forEach ciclamos en cada valor, esa infomacion nos permite tener acceso al metodo send para enviar el mensaje*/ 
                        connection.send && connection.send(msg) //enviamos el mensaje
                    })
                    break;

                case "msg":
                    if (data.recieve.length > 0) { //verificamos si el mensaje al destinatario no esta vacio
                        connections[data.name].send(msg = JSON.stringify({ //se envia el mensaje al remitente
                            "type": 'msg',
                            "name": data.name,
                            "msg": data.msg
                        }))
                        connections[data.recieve].send(msg = JSON.stringify({ // se envia el mensaje al destinatario
                            "type": 'msg',
                            "name": data.name,
                            "msg": data.msg
                        }))

                    }
                    break;

                case 'logout':
                    delete connections[data.name] //eliminamos al usuario que se hizo logout de connections
                    delete imageConnection[data.name] //eliminamos la imagen del usuario que hizo logout de imageConnection
                    msg = JSON.stringify({ //creamos un mensaje
                        "type": "join",
                        "names": Object.keys(connections),
                        "imageUsers": imageConnection
                    })
                    Object.values(connections).forEach((connection) => { //volvemos a mandar todos los que estan conectados para actualizar el front
                        connection.send && connection.send(msg)
                    })
                    break;
            }
        })
    })
}