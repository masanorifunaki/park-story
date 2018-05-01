'use strict';
const express = require('express');
const router = express.Router();
const auth = require('http-auth');
const Course = require('../models/course');
const Candidate = require('../models/candidate');
const moment = require('moment-timezone');

const basic = auth.basic({
    realm: 'Enter username and password.',
    file: './users.htpasswd'
});

router.get('/new', auth.connect(basic), (req, res, next) => {
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

router.get('/:courseId/:candidateId', (req, res, next) => {
    Candidate.findOne({
        include: [{
            model: Course,
            attributes: ['courseId', 'courseName', 'courseMemo', 'courseDay']
        }],
        where: {
            candidateId: req.params.candidateId
        },
        order: '"updatedAt" DESC'
    }).then((candidate) => {
        candidate.course.formattedCourseDay = moment(candidate.course.courseDay).tz('Asia/Tokyo').format('YYYY/MM/DD');
        res.render('course', {
            user: req.user,
            candidate: candidate,
            formattedCourseDay: candidate.course.formattedCourseDay
        });
    });
});

module.exports = router;