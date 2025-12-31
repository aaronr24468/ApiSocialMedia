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
//import { WebSocketServer } from "ws";
import { config } from 'dotenv';
config();

const port = process.env.PORT || 9191

const app = express();
const server = http.createServer(app)

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(dirname(fileURLToPath(import.meta.url))));

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/v1/social',
    expressjwt({
        secret: 'secret',
        algorithms: ["HS256"],
        getToken: (req) => req.cookies.socialMediaToken //se agrego get token para obtener el token de las cookies
    }),
    infoRouter)

// app.get('/', (request, response) =>{
//     response.redirect('/v1/social')
// })

app.use((err, request, response, next) => {
    if (err.name === 'UnauthorizedError') {
        response.status(401).json('Unauthorized')
    } else {
        next();
    }
})


webSocket(server);

server.listen(port, () => {
    console.log(`Listening to the http://localhost:${port}`);
}) 