import mysql from 'mysql2/promise';
import {config} from 'dotenv';
config();

const connection = await mysql.createConnection({
    host: `${process.env.HOST}`,
    user: `${process.env.USER}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DB}`
})

export const getUser = async(data) =>{
    const query = `SELECT * FROM users WHERE username=?`;
    const [user] = await connection.query(query, [data.username])
    return(user) 
}

export const getC = async(data) =>{
    const query = `SELECT * FROM ${data.type} WHERE user != ?`;
    const [content] = await connection.query(query, [data.user]);
    return(content)
}

export const uploadI = async(data) =>{
    const query = `INSERT INTO photos(user, userPhoto, title, description, date, likes, comments, photo)values(?,?,?,?,?,?,?,?)`;
    await connection.query(query, [data.user, data.imageUser, data.title, data.description, data.date, data.likes, data.comments, data.photo])
}

export const uploadV = async(data) =>{
    const query = `INSERT INTO videos(user, userPhoto, title, description, date, likes, comments, video)values(?,?,?,?,?,?,?,?)`;
    await connection.query(query, [data.user, data.imageUser, data.title, data.description, data.date, data.likes, data.comments, data.video])
} 

export const likeC = async(data) =>{
    const query = `SELECT * FROM ${data.type} WHERE id=?`;
    const [info] = await connection.query(query, [data.id])
    return(info);
}

export const saveM = async(data) =>{
    const query = `SELECT * FROM chats WHERE user1=? AND user2=? OR user1=? AND user2=?`;
    
    const [res] = await connection.query(query, [data.user1, data.user2, data.user2, data.user1]);
    if(res.length === 0){
        const query = `INSERT INTO chats(user1, user2, chat)values(?,?,?)`;
        await connection.query(query, [data.user1, data.user2, data.msg])
    }else{
        const chat = res[0].chat.concat(' '+data.msg)
        const query =  `UPDATE chats SET chat=? WHERE id=?`;
        await connection.query(query, [chat, res[0].id])
    }
}

export const getM = async(info) =>{
    const query = `SELECT chat FROM chats WHERE user1=? AND user2=? OR user1=? AND user2=?`;
    const [res] = await connection.query(query, [info.user1, info.user2, info.user2, info.user1]);
    return(res)
    
}