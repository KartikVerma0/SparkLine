const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2");
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PWD, {
    host: process.env.DATABASE_HOSTNAME,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    dialectModule: mysql2
})

module.exports = sequelize;