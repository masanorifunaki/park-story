'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Course = loader.database.define('courses', {
    courseId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    courseName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    courseDescription: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = Course;