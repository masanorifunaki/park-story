'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const timeFrame = loader.database.define('time_frames', {
    courseId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    courseTime: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = timeFrame;