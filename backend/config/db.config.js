require('dotenv').config();

module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        trustServerCertificate: true,
    }
}