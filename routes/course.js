'use strict';
const express = require('express');
const router = express.Router();
const auth = require('http-auth');
const Course = require('../models/course');
const Candidate = require('../models/candidate');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const moment = require('moment-timezone');
const authenticationEnsurer = require('./authentication-ensurer');

const basic = auth.basic({
    realm: 'Enter username and password.',
    file: './users.htpasswd'
});

router.get('/new', authenticationEnsurer, auth.connect(basic), (req, res, next) => {
    res.render('new', {
        user: req.user
    });
});

router.post('/', (req, res, next) => {
    Course.create({
        courseName: req.body.courseName,
        courseMemo: req.body.courseMemo,
        courseDay: req.body.courseDay
    }).then((course) => {
        const candidateTimes = req.body.candidates.trim().split('\n').map((s) => s.trim());
        const candidates = candidateTimes.map((c) => {
            return {
                candidateTime: c,
                courseId: course.courseId
            };
        });
        Candidate.bulkCreate(candidates).then(() => {
            res.redirect('/');
        });
    });
});

router.get('/:courseId/:candidateId', authenticationEnsurer, (req, res, next) => {
    Candidate.findOne({
        include: [{
            model: Course,
            attributes: ['courseId', 'courseName', 'courseMemo', 'courseDay']
        }],
        where: {
            candidateId: req.params.candidateId
        },
        order: '"updatedAt" DESC'
    }).then((c) => {
        c.course.formattedCourseDay = moment(c.course.courseDay).tz('Asia/Tokyo').format('YYYY年MM月DD日');
        if (req.user.id && Appointment) {
            Appointment.findOne({
                where: {
                    userId: req.user.id,
                    candidateId: req.params.candidateId
                }
            }).then((appointment) => {
                res.render('course', {
                    user: req.user,
                    candidate: c,
                    appointment: appointment,
                    formattedCourseDay: c.course.formattedCourseDay,
                });
            });
        } else {
            res.render('course', {
                user: req.user,
                candidate: c,
                formattedCourseDay: c.course.formattedCourseDay,
            });
        }
    });
});

module.exports = router;