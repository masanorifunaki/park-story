'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const appointment = loader.database.define('appointments', {
    userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = appointment;