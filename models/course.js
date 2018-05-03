'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Course = loader.database.define('courses', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    courseName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    courseMemo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    courseDay: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    courseImgFile: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

module.exports = Course;