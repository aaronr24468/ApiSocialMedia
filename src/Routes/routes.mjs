import { Router } from "express";
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { getContent, getListUsers, getMessage, getUserData, likeContent, logOut, saveMessage, uploadImage, uploadVideos, validUser } from "../controllers/controllers.mjs";

const diskStorageImages = multer.diskStorage({ //creamos la ruta de donde se van a guardar las fotos y el como se llama el archivo en el metodo cb
    destination: join(dirname(fileURLToPath(import.meta.url)), '../media/userPhotos'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});

const diskStorageVideos = multer.diskStorage({ //creamos la ruta de donde se van a guardar las videos y el como se llama el archivo en el metodo cb
    destination: join(dirname(fileURLToPath(import.meta.url)), '../media/userVideos'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});

const getImage = multer({//guardamos en una variable a multer el cual dice donde esta el storage
    storage: diskStorageImages
}).array('image');//le decimos que vamos a recivir varias imagenes y con el id de image en formData

const getVideos = multer({//guardamos en una variable a multer el cual dice donde esta el storage
    storage: diskStorageVideos
}).single('video'); //le decimos que vamos a recivir un video y con el id de image en formData


export const router = Router();

router.get('/getUser', getUserData); //aqui optenemos toda la informacion del usuario para poder tener la url y objetos que ocupemos para guardar y tener acceso en la pagina

router.get('/validToken', validUser) //endpoint para validar si el usuario sigue conectado, validacion con la cookie del navegador

router.get('/getContent/:type', getContent) //obtenemos imagenes o videos dependiendo el type que se mande del fron

router.post('/uploadPhoto/:info', getImage, uploadImage); //obtenemos la imagen por getImage y con uploadImage subimos el url de donde se aloja

router.post('/uploadVideo/:info', getVideos, uploadVideos); //obtenemos la video por getVideos y con uploadVideos subimos el url de donde se aloja

router.post('/likeContent/:id', likeContent);

router.post('/saveMessage', saveMessage);// guardamos los mensajes de los usuarios en la DB

router.post('/getMessage', getMessage); //hacemos un request para obtener los mensajes de los usuarios

router.post('/getListUsers', getListUsers) //obtenemos la lista de usuaios que esten en la plataforma

router.get('/logout', logOut) //eliminamos la cookie de el token para hacer logout
