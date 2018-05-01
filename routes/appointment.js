'use strict';
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

router.post('/:courseId/:candidateId/:userId/submit', (req, res, next) => {
    // const courseId = parseInt(req.params.courseId);
    // const candidateId = parseInt(req.params.candidateId);
    // const userId = req.params.userId;
    let appointment = req.body.appointment;
    appointment = appointment ? parseInt(appointment) : 0;

    Appointment.upsert({
        candidateId: req.params.candidateId,
        userId: req.params.userId,
        appointment: appointment,
        courseId: req.params.courseId
    }).then(() => {
        res.redirect('/');
    });
});

module.exports = router;