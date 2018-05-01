'use strict';
const express = require('express');
const router = express.Router();
const auth = require('http-auth');
const Course = require('../models/course');
const Candidate = require('../models/candidate');

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

module.exports = router;