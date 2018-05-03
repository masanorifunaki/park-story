'use strict';
var express = require('express');
var router = express.Router();

const Course = require('../models/course');
const Candidate = require('../models/candidate');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const moment = require('moment-timezone');
const authenticationEnsurer = require('./authentication-ensurer');

router.get('/mypage/:userId', authenticationEnsurer, (req, res, next) => {

    Appointment.findAll({
        include: [{
            model: Candidate,
            attributes: ['candidateId', 'candidateTime'],
            include: [{
                model: Course,
                attributes: ['courseId', 'courseName', 'courseMemo', 'courseDay', 'courseImgFile'],
            }],
        }],
        where: {
            appointment: 1,
            userId: req.user.id
        }
    }).then((candidates) => {
        res.render('mypage', {
            candidates: candidates
        });
    });
});

module.exports = router;