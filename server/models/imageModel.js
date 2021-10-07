const { DataTypes } = require("sequelize");
const sequelize = require('../db/sequelize');

const Image = sequelize.define("image", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bucket: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Image;

