import mysql from 'mysql2/promise';
import {config} from 'dotenv';
config();

const connection = await mysql.createConnection({
    host: `${process.env.HOST}`,
    user: `${process.env.USER}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DB}`
})

export const registerUser = async (data = {}) => {
    const query = `INSERT INTO users(username, password, name, lastname, day, month, year, image, videos, photos)values(?,?,?,?,?,?,?,?,?,?)`;
    await connection.query(query, [data.username, data.password, data.name, data.lastname, data.day, data.month, data.year, data.image, data.videos, data.photos])
}

export const setPhotoUser = async (data) => {
    console.log(data)
    const query = `SELECT * FROM users WHERE username=?`;
    const [user] = await connection.query(query, [data.username])
    console.log(user[0].username)

    const query2 = `UPDATE users SET image=? WHERE id=?`;
    await connection.query(query2, [data.image, user[0].id])
} 