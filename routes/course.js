'use strict';
const express = require('express');
const router = express.Router();
const auth = require('http-auth');
const multer = require('multer');
const upload = multer({
    dest: './public/images/uploads/'
});
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true
});
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

router.get('/new', authenticationEnsurer, auth.connect(basic), csrfProtection, (req, res, next) => {
    res.render('new', {
        user: req.user,
        csrfToken: req.csrfToken()
    });
});

router.post('/', upload.single('courseImgFile'), csrfProtection, (req, res, next) => {
    const path = req.file.path;
    cloudinary.uploader.upload(path, (result) => {
        Course.create({
            courseName: req.body.courseName,
            courseMemo: req.body.courseMemo,
            courseDay: req.body.courseDay,
            courseImgFile: result.url,
            coursePlace: req.body.coursePlace,
        }).then((course) => {
            const candidateTimes = parseCandidateTimes(req);
            if (candidateTimes) {
                createCandidatesAndRedirect(candidateTimes, course.courseId, res);
            } else {
                res.redirect('/');
            }
        });
    });
});

router.get('/:courseId/:candidateId', (req, res, next) => {
    let allUsers = null;
    let promiseAllusers = Appointment.findAll({
        include: [{
            model: User,
            attributes: ['userId', 'userName', 'userImg', ]
        }],
        where: {
            candidateId: req.params.candidateId,
            appointment: 1,
        }
    }).then((a) => {
        allUsers = a;
    });

    // TODO: プロミスしたほうが良いのかな？
    Candidate.findOne({
        include: [{
            model: Course,
            attributes: ['courseId', 'courseName', 'courseMemo', 'courseDay', 'coursePlace']
        }],
        where: {
            candidateId: req.params.candidateId
        },
        order: '"updatedAt" DESC'
    }).then((c) => {
        c.course.formattedCourseDay = formattedCourseDay(c.course.courseDay);
        if (loginCheck(req)) {
            Appointment.findOne({
                where: {
                    userId: req.user.id,
                    candidateId: req.params.candidateId
                }
            }).then((appointment) => {
                Promise.all(promiseAllusers);
                res.render('course', {
                    user: req.user,
                    candidate: c,
                    appointment: appointment,
                    formattedCourseDay: c.course.formattedCourseDay,
                    allUsers: allUsers
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


router.get('/:courseId/:candidateId/edit', authenticationEnsurer, auth.connect(basic), csrfProtection, (req, res, next) => {
    Course.findOne({
        where: {
            courseId: req.params.courseId
        }
    }).then((course) => {
        Candidate.findAll({
            where: {
                courseId: course.courseId
            },
            order: '"candidateId" ASC'
        }).then((candidates) => {
            res.render('edit', {
                user: req.user,
                course: course,
                candidates: candidates,
                csrfToken: req.csrfToken()
            });
        });
    });
});

router.post('/:courseId', authenticationEnsurer, auth.connect(basic), csrfProtection, (req, res, next) => {
    if (parseInt(req.query.edit) === 1) {
        Course.findOne({
            where: {
                courseId: req.params.courseId
            }
        }).then((course) => {
            Course.upsert({
                courseId: course.courseId,
                courseName: req.body.courseName,
                courseMemo: req.body.courseMemo,
                courseDay: req.body.courseDay,
                coursePlace: req.body.coursePlace,
            }).then(() => {
                const candidateTimes = parseCandidateTimes(req);
                if (candidateTimes) {
                    createCandidatesAndRedirect(candidateTimes, req.params.courseId, res);
                } else {
                    res.redirect('/');
                }
            });
        });
    } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        err.message = '不正なリクエストです';
        res.render('err400', {
            err: err,
        });
    }
});

router.post('/:courseId/:candidateId', authenticationEnsurer, auth.connect(basic), (req, res, next) => {
    if (parseInt(req.query.delete) === 1) {
        deleteCandidateAppointment(req.body.courseId, req.body.candidateId, res);
    }
});

function deleteCandidateAppointment(courseId, candidateId, res) {
    // TODO: コース自体の削除をどうするか考える
    Appointment.findAll({
        where: {
            candidateId: candidateId,
        }
    }).then((appointments) => {
        const promises = appointments.map((a) => {
            return a.destroy();
        });
        return Promise.all(promises);
    }).then(() => {
        Candidate.findOne({
            where: {
                courseId: courseId,
                candidateId: candidateId
            }
        }).then((candidate) => {
            return candidate.destroy();
        });
    }).then((candidate) => {
        if (!candidate) {
            Course.findById(courseId).then((course) => {
                return course.destroy();
            });
        } else {
            res.redirect('/');
        }
    });
}

function createCandidatesAndRedirect(candidateTimes, courseId, res) {

    const candidates = candidateTimes.map((c) => {
        return {
            candidateTime: c,
            courseId: courseId
        };
    });
    Candidate.bulkCreate(candidates).then(() => {
        res.redirect('/');
    });
}

//リクエストから候補日の配列をパースする処理
function parseCandidateTimes(req) {
    return req.body.candidates.trim().split('\n').map((s) => s.trim());
}

// ログインチェック
function loginCheck(req) {
    if (req.user && req.user.id && Appointment) {
        return true;
    } else {
        return false;
    }
}

router.loginCheck = loginCheck;

// 年月日フォーマット
function formattedCourseDay(courseDay) {
    return moment(courseDay).tz('Asia/Tokyo').format('YYYY年MM月DD日');
}

router.formattedCourseDay = formattedCourseDay;

module.exports = router;