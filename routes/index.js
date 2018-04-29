var express = require('express');
var router = express.Router();
const Course = require('../models/course');
const TimeFrame = require('../models/time_frame');
const Appointment = require('../models/appointment');

/* GET home page. */
router.get('/', function (req, res, next) {
    const title = '東京公園ストーリー';
    TimeFrame.findAll({
        include: [{
            model: Course,
            attributes: ['courseId', 'courseName', 'courseDescription']
        }],
        order: '"updatedAt" DESC'
    }).then((courses) => {
        res.render('index', {
            title: title,
            user: req.user,
            courses: courses
        });
    });
});

router.post('/submit', (req, res, next) => {
    Appointment.upsert({
        userId: req.body.userId,
        courseId: req.body.courseId
    }).then(() => {
        res.redirect('/');
    });
});

module.exports = router;