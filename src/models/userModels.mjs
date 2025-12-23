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