import express from "express";
import { expressjwt } from "express-jwt";
import cors from 'cors';
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import morgan from "morgan";
import { router as registerRouter } from "./Routes/registerRouter.mjs";
import { router as loginRouter } from "./Routes/loginRouter.mjs";
import { router as infoRouter } from "./Routes/routes.mjs";
import { webSocket } from "./webSocket.mjs";
import {config} from 'dotenv';
config();

const port = process.env.PORT
 
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(dirname(fileURLToPath(import.meta.url))));

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/v1/social',expressjwt({secret:'secret', algorithms: ["HS256"]}), infoRouter)

app.get('/', (request, response) =>{
    response.redirect('/v1/social')
})

app.use((err, request, response, next) =>{
    if(err.name === 'UnauthorizedError'){
        response.status(401).json('Unauthorized')
    }else{ 
        next();
    } 
})

webSocket(); 

app.listen(8080, () =>{
    console.log(`Listening to the http://localhost:${port}`);
})