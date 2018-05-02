'use strict';
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

router.post('/:courseId/:candidateId/:userId/ajax', (req, res, next) => {
    const candidateId = req.body.candidateId;
    const courseId = req.params.courseId;
    let appointment = req.body.appointment;
    appointment = appointment ? parseInt(appointment) : 0;

    Appointment.upsert({
        candidateId: candidateId,
        userId: req.params.userId,
        appointment: appointment,
        courseId: courseId
    }).then(() => {
        res.json({
            status: 'OK',
            appointment: appointment
        });
    });
});

router.post('/:courseId/:candidateId/:userId/submit', (req, res, next) => {
    const courseId = parseInt(req.params.courseId);
    const candidateId = parseInt(req.params.candidateId);
    let appointment = req.body.appointment;

    appointment = appointment ? parseInt(appointment) : 0;

    Appointment.upsert({
        candidateId: candidateId,
        userId: req.params.userId,
        appointment: appointment,
        courseId: courseId
    }).then(() => {
        res.redirect(`/course/${courseId}/${candidateId}`);
    });
});

module.exports = router;