'use strict';
var express = require('express');
var router = express.Router();

const Course = require('../models/course');
const Candidate = require('../models/candidate');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const moment = require('moment-timezone');
const authenticationEnsurer = require('./authentication-ensurer');
const formattedCourseDay = require('../routes/course').formattedCourseDay;

router.get('/mypage', authenticationEnsurer, (req, res, next) => {
    if (userCheck(req)) {
        Appointment.findAll({
            include: [{
                model: Candidate,
                attributes: ['candidateId', 'candidateTime'],
                include: [{
                    model: Course,
                    attributes: ['courseId', 'courseName', 'courseMemo', 'courseDay', 'courseImgFile', 'coursePlace'],
                }],
            }],
            where: {
                appointment: 1,
                userId: req.user.id
            }
        }).then((candidates) => {
            candidates.forEach((candidate) => {
                candidate.candidate.course.formattedCourseDay = formattedCourseDay(candidate.candidate.course.courseDay);
            });
            res.render('mypage', {
                user: req.user,
                candidates: candidates
            });
        });
    } else {
    // 不正リクエスト処理
        const err = new Error('不正なリクエストです');
        err.status = 400;
        err.message = '不正なリクエストです';
        res.render('err400', {
            err: err,
        });
    }
});

// ユーザーチェック
function userCheck(req) {
    if (req.params.userId === req.user.userId) {
        return true;
    } else {
        return false;
    }
}

router.userCheck = userCheck;

module.exports = router;