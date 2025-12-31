import { Router } from "express";
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { getContent, getListUsers, getMessage, getUserData, likeContent, logOut, saveMessage, uploadImage, uploadVideos, validUser } from "../controllers/controllers.mjs";

const diskStorageImages = multer.diskStorage({
    destination: join(dirname(fileURLToPath(import.meta.url)), '../media/userPhotos'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});

const diskStorageVideos = multer.diskStorage({
    destination: join(dirname(fileURLToPath(import.meta.url)), '../media/userVideos'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});

const getImage = multer({
    storage: diskStorageImages
}).array('image');

const getVideos = multer({
    storage: diskStorageVideos
}).single('video');


export const router = Router();

router.get('/getUser', getUserData); //aqui optenemos toda la informacion del usuario para poder tener la url y objetos que ocupemos para guardar y tener acceso en la pagina

router.get('/validToken', validUser)

router.get('/getContent/:type', getContent)

router.post('/uploadPhoto/:info', getImage, uploadImage);

router.post('/uploadVideo/:info', getVideos, uploadVideos);

router.post('/likeContent/:id', likeContent);

router.post('/saveMessage', saveMessage);

router.post('/getMessage', getMessage);

router.post('/getListUsers', getListUsers)

router.get('/logout', logOut)
