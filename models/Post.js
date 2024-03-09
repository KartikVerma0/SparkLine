const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const User = require('./User')


const Post = sequelize.define('Post', {
    postid: {
        type: DataTypes.NUMBER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    posttext: {
        type: DataTypes.STRING
    },
    userid: {
        type: DataTypes.NUMBER,
    },
    media: {
        type: DataTypes.STRING
    },
    numlikes: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    numreposts: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    posttime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
}, { tableName: 'post', createdAt: false, updatedAt: false })

User.hasMany(Post, {
    foreignKey: 'userid',
    sourceKey: 'userid' // Specify the source key in the User model
});

Post.belongsTo(User, {
    foreignKey: 'userid',
    targetKey: 'userid' // Specify the target key in the Post model
});


module.exports = Post;