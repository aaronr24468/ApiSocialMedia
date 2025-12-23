import bcrypt from 'bcrypt';
import { registerUser, setPhotoUser } from "../models/registerModels.mjs";

const saltRound = 10;
export const registerU = async(request, response) =>{
    try {
        try {
        const data = {
            username: request.body.username,
            password: request.body.password,
            name: request.body.name,
            lastname: request.body.lastname,
            day: request.body.day,
            month: request.body.month,
            year: request.body.year,
            image: ``,
            videos: '',
            photos: '' 
        }
        console.log(request.body.formData)
        bcrypt.hash(data.password, saltRound, async(err, hash) => {
            data.password = hash;
            registerUser(data);
        })
        response.status(200).json('S') 
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
    } catch (error) {
        
    }
}

export const uploadProfilePhoto = async(request, response) =>{
    try {
        const dataImage = {
            username: request.params.username,
            image: `http://localhost:8080/media/userProfilePhoto/${request.file.filename}`
        }
        await setPhotoUser(dataImage)
        response.status(200).json('S')
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    } 
} 