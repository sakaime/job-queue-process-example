import mysql from 'mysql2/promise'

export const connectDb = async () => await mysql.createConnection({
    host: 'mysql',
    user: 'user',
    database: 'db',
    password: 'password'
});