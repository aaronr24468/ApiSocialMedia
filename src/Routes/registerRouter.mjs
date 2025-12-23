import { Router } from "express";
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { registerU, uploadProfilePhoto } from "../controllers/registerControllers.mjs";


const diskStorage = multer.diskStorage({
    destination: join(dirname(fileURLToPath(import.meta.url)), '../media/userProfilePhoto'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});

const getPhoto = multer({
    storage:diskStorage
}).single('image')

export const router = Router();



router.put('/', registerU) 

router.post('/setPhoto/:username', getPhoto, uploadProfilePhoto) 