'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Board = loader.database.define('boards', {
    boardId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    candidateId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    boardContent: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    postBy: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Board;