var express = require('express');
var router = express.Router();
const Course = require('../models/course');
const Candidate = require('../models/candidate');
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', function (req, res, next) {
    const title = '東京公園ストーリー';
    Candidate.findAll({
        include: [{
            model: Course,
            attributes: ['courseId', 'courseName', 'courseMemo', 'courseDay', 'courseImgFile']
        }],
        order: '"updatedAt" DESC'
    }).then((candidates) => {
        candidates.forEach((candidate) => {
            candidate.course.formattedCourseDay = moment(candidate.course.courseDay).tz('Asia/Tokyo').format('YYYY/MM/DD');
        });
        res.render('index', {
            title: title,
            user: req.user,
            candidates: candidates
        });
    });

});

router.get('/privacy', (req, res, next) => {
    res.render('privacy');
});

module.exports = router;