import { Router } from "express";
import bcrypt from 'bcrypt';
import { getUser } from "../models/userModels.mjs";
import jwt from 'jsonwebtoken';


export const router = Router();

router.post('/', async (request, response) => {
    try {
        const data = {
            username: request.body.username,
            password: request.body.password
        }
        const user = await getUser(data);
        bcrypt.compare(data.password, user[0].password, (err, result) => {
            if (result === true) {
                const token = jwt.sign(user[0], 'secret');
                response.cookie("socialMediaToken", token,{
                    httpOnly: true,
                   
                })
                response.status(200).json({login: true})
            } else {
                response.status(405).json('F')
            }
        })
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
})