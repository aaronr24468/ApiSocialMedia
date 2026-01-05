import express from "express";
import http from 'http';
import { expressjwt } from "express-jwt";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from "url";
import morgan from "morgan";

import { router as registerRouter } from "./Routes/registerRouter.mjs";
import { router as loginRouter } from "./Routes/loginRouter.mjs";
import { router as infoRouter } from "./Routes/routes.mjs";
import { webSocket } from "./webSocket.mjs";
import { config } from 'dotenv';
config(); //incializamos config de dotenv para poder tener accedo a los datos de .env

const port = process.env.PORT || 9191 //obtenermos el puerto que se le asigno por medio de .env en PORT

const app = express(); //se inicializa expres por medio de la variable app
const server = http.createServer(app)//inicializamos un server

app.use(morgan('dev'));

app.use(cors({ //ocupamos las caracteristicas del cors para cuando usamos cookies
    origin: 'https://socialmediaweb-q9ug.onrender.com', //el dominio del fron end
    credentials: true //nos permite enviar datos sencibles del front al back, esto se tiene que activar igual en cualquier peticion en el front y ponerle include
}));

app.use(cookieParser()); //inicializamos cookieParser
app.use(express.json()); //le decimos que aceptamos datos tipos json que se manden desde una peticion http
app.use(express.urlencoded({ extended: false }));
app.use(express.static(dirname(fileURLToPath(import.meta.url)))); //le decimos donde puede tener acceso a las carpetas para que pueda mostrar las imagenes desde la ruta al navegador

app.use('/register', registerRouter); //middleware con la ruta register para registrar nuevos usuarios
app.use('/login', loginRouter); // middleware con la ruta login, se verifica usuario y se manda el token por medio de una cookie
app.use('/v1/social', //middleware de todas la ruta madre para poder tener toda la informacion que se requiera
    expressjwt({ //validamos que tengamos un token de jwt
        secret: 'secret',
        algorithms: ["HS256"],
        getToken: (req) => req.cookies.socialMediaToken //se agrego get token para obtener el token de las cookies
    }),
    infoRouter)

// app.get('/', (request, response) =>{
//     response.redirect('/v1/social')
// })

app.use((err, request, response, next) => { //con este middleware revizamos cada vez que se haga una peticion en v1 que tengamos el token de lo contrario nos manda Unauthorized
    if (err.name === 'UnauthorizedError') {
        response.status(401).json('Unauthorized')
    } else {
        next();
    }
})


webSocket(server); //iniciamos webSocketServer para el chat en tiempo real

server.listen(port, () => {
    console.log(`Listening to the http://localhost:${port}`);
}) 