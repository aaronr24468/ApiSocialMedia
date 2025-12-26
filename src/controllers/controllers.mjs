import { getC, getM, likeC, saveM, uploadI, uploadV } from "../models/userModels.mjs";

export const getUserData = (request, response) =>{
    try {
        //console.log(request.auth)
        response.status(200).json(request.auth)
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const getContent = async(request, response) =>{
    try {
        const data = {
            user: request.auth.username,
            type: request.params.type
        }
        const constent = await getC(data);
        response.status(200).json(constent)
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const uploadImage = async(request, response) =>{
    try {
        const info = request.params.info.split("&")
        const userData = request.auth;
        const date = new Date();
        const dateSlice = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
        const data = {
            user: userData.username,
            imageUser: userData.image,
            title: info[0],
            description: info[1],
            date: dateSlice,
            likes: '',
            comments: '',
            photo:`http://localhost:8080/media/userPhotos/${request.files[0].filename}`
        }
        //console.log(request)
        await uploadI(data)
        response.status(200).json('S')
    } catch (e) {
        console.error(e)
        response.status(401).json('F') 
    }
}

export const uploadVideos = async(request, response) =>{ 
    try {
        const info = request.params.info.split("&")
        const userData = request.auth;
        const date = new Date();
        const dateSlice = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
        //console.log(dateSlice)
        const data = {
            user: userData.username,
            imageUser: userData.image,
            title: info[0],
            description: info[1],
            date: dateSlice,
            likes: '',
            comments: '',
            video:`http://localhost:8080/media/userVideos/${request.file.filename}`
        }
        await uploadV(data)
        response.status(200).json('S')
    } catch (e) {
        console.error(e)
        response.status(401).json('F')
    } 
} 
 
export const likeContent = async(request, response) =>{
    try {
        const data = {
            id: request.params.id,
            user: request.auth.username,
            type: request.body.type
        }
        const res = await likeC(data)
        console.log(data.type)
        response.status(200).json(res)
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const saveMessage = async(request, response) =>{
    try {
        const data = {
            user1: request.body.user1,
            user2: request.body.user2,
            msg: `${request.body.user1}~${request.body.msg}`
        }

        data.msg = data.msg.replace(/\s/g, "|");

        await saveM(data)
        response.status(200).json('S')
        
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const getMessage = async(request, response) =>{
    try {
        const info = {
            user1: request.body.user1,
            user2: request.body.user2,
        }
        const chat = await getM(info);
        
        console.log(chat.length)
        if(chat.length!=0){
            const splitData = chat[0].chat.split(' ');
            response.status(200).json(splitData)
        }else{
            response.status(200).json("EMPTY")
        }
        
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}