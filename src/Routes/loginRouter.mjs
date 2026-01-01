import { Router } from "express";
import bcrypt from 'bcrypt';
import { getUser } from "../models/userModels.mjs";
import jwt from 'jsonwebtoken';


export const router = Router();

router.post('/', async (request, response) => {
    try {
        const data = { //obtenemos la informacion del usuario
            username: request.body.username,
            password: request.body.password
        }
        const user = await getUser(data); //aqui andamos a llamar un metodo el cual le pasamos la data y guardamos la respuesta en user la cual tiene que tener toda la info del usuario
        bcrypt.compare(data.password, user[0].password, (err, result) => { //comparamos la password del usuario con la que esta en la DB la cual esta encryptada con bcrypt
            if (result === true) { //si el resultado de la comparacion es verdadera entra a la condicion
                const token = jwt.sign(user[0], 'secret'); //creamos el token con los datos de la base de datos
                response.cookie("socialMediaToken", token,{ //le mandamos la cookie a el navegador con la key socialMediaToken y el valor del token
                    httpOnly: true, //le decimos que solo se puede acceder a la cookie por medio de consultas http, solo se puede consultar las cookies desde el backend
                    secure: true, //poner en falso cuando estemos haciendo pruebas y en true cuando este en produccion si no dara error de cors
                    sameSite: 'none', //le decimos que el dominio es igual o no es igual al backend
                    partitioned: true
                })
                response.status(200).json({login: true}) //le respondemos con un objeto diciendo que el login es correcto con un true
            } else {
                response.status(405).json('F') //si las password no coinciden, mandamos un F
            }
        })
    } catch (e) {
        console.error(e);
        response.status(401).json('F') //en caso de que tengamos algun problema con el metodo nos mandara una F
    }
})