import { getC, getListU, getM, likeC, saveM, uploadI, uploadV } from "../models/userModels.mjs";

export const getUserData = (request, response) =>{
    try {
        //console.log(request.cookies)
        response.status(200).json(request.auth) //mandamos toda la info del usuario desde la informacion guardada en el token
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const validUser = (request, response ) =>{
    try {
        const token = request.cookies.socialMediaToken; //obtenemos el token de las cookies del navegador por medio de credentials en el http request
        console.log(token)
        response.status(200).json({login: true})// si se encuentra el token mandaremos esto, de lo contrario se mandara un mensaje
    } catch (e) {
        response.status(401).json('Unauthorized')
    }
}

export const getContent = async(request, response) =>{ //obtenemos el contenido que el usuario elija, videos o imagenes por medio del type
    try {
        const data = {
            user: request.auth.username,
            type: request.params.type
        }
        const constent = await getC(data); //llamamos el metodo getC para obtener la info de la DB
        response.status(200).json(constent)
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const uploadImage = async(request, response) =>{
    try {
        const info = request.params.info.split("&");//separamos la info que nos manda de los parametros del endPoint, titulo y descripccion
        const userData = request.auth; //obtenemos la info del usuario por medio de auth, esto es por medio de JWT
        const date = new Date(); //inicializamos el metodo de fechas de JS
        const dateSlice = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`; //creamos una variable que alberga la fecha en dia, mes y year
        const data = { //creamos un objeto el cual guarda toda la info que mandaremos a la DB
            user: userData.username,
            imageUser: userData.image,
            title: info[0],
            description: info[1],
            date: dateSlice,
            likes: '',
            comments: '',
            photo:`https://apisocialmedia-oesl.onrender.com/media/userPhotos/${request.files[0].filename}` //ponermos el url y por medio de request obtenemos el nombre del la imagen
        }
        //console.log(request)
        await uploadI(data) //usamos el metodo y le mandamos data
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
            video:`https://apisocialmedia-oesl.onrender.com/media/userVideos/${request.file.filename}`
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

/*para guardar los mensajes obtenemos los nombres de usuarios y en mensaje ponemos el nombre y el mensaje, acompanado de un caracter especial, despues el mensaje se cambian todos
los espacios con regex y con la g de regex le decimos que todos los espacios los cambie a el simbolo seleccionado*/
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

//obtenemos los mensajes de los usuario, por medio de los nombres se hace una consulta en mysql para decirle que si coinsiden los nombres nos regrese el chat
export const getMessage = async(request, response) =>{
    try {
        const info = {
            user1: request.body.user1,
            user2: request.body.user2,
        }
        const chat = await getM(info);
        
        //console.log(chat.length)
        if(chat.length!=0){ //aqui verificamos que si tengamos un chat de lo contrario se ejecuta el else de que estos usuarios no han tenido una conversacion
            const splitData = chat[0].chat.split(' '); //aqio se separa cada mensaje ejemplo (aaronr244:~hola|como|estas:::Sabanita:~Hola|bien) el espacio es donde estan los ::: y el split nos convierte la string en un array
            response.status(200).json(splitData)
        }else{
            response.status(200).json("EMPTY")
        }
        
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

//obtenemos la lista de los usuario a buscar y lo filtramo para que salga los que den match y ademas ponemos una condicion para que nunca nos mande nuestro usuario
export const getListUsers = async(request, response) =>{
    try {
        const search = request.body.value;
        const mainUser = request.body.user;

        const users = await getListU();

        const filterUsers = users.filter((element) => {
            return(element.username.toLowerCase().includes(search))
        })
        response.status(200).json(filterUsers)
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const logOut = (request, response) =>{
    try {
        response.clearCookie('socialMediaToken',{ //eliminamos la cookie, es importante tener los mismos parametros menos httpOnly para poder eliminar la cookie del navegador
            secure: true,
            sameSite: "none",
            partitioned: true
        });
        response.status(200).json({logout: true})
    } catch (e) {
        console.error(e);
        response.status.json({logout: false})
    }
}