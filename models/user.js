'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
    userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userImg: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = User;