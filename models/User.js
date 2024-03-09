const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const User = sequelize.define('users', {
    userid: {
        type: DataTypes.NUMBER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordhash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
    },
    mobile: {
        type: DataTypes.NUMBER
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pic: {
        type: DataTypes.STRING
    },
    profiletext: {
        type: DataTypes.STRING
    },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    }
}, { createdAt: false, updatedAt: false });

module.exports = User;