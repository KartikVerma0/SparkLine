const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PWD, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize;