'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Appointment = loader.database.define('appointments', {
    candidateId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    appointment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    courseId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    indexes: [{
        fields: ['courseId']
    }]
});

module.exports = Appointment;