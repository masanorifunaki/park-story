'use strict';
const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const TimeFrame = require('../models/time_frame');

router.get('/edit', (req, res, next) => {
    res.render('edit', {
        user: req.user
    });
});

router.post('/', (req, res, next) => {
    Course.create({
        courseName: req.body.courseName,
        courseDescription: req.body.courseDescription
    }).then((course) => {
        TimeFrame.create({
            courseTime: req.body.courseTime
        }).then(() => {
            res.redirect('/');
        });
    });
});

module.exports = router;