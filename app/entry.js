'use strict';
import $ from 'jquery';

$('.appointment-toggle-button').each((i, e) => {
    const button = $(e);
    button.click(() => {
        const courseId = button.data('course-id');
        const userId = button.data('user-id');
        const candidateId = button.data('candidate-id');
        const appointment = parseInt(button.data('appointment'));
        const nextAppointment = (appointment + 1) % 2;

        $.post(`/course/${courseId}/${candidateId}/${userId}/ajax`, {
            candidateId: candidateId,
            appointment: nextAppointment
        },
        (data) => {
            button.data('appointment', data.appointment.appointment);
            const appointmentLabels = ['参加します', 'キャンセルします'];
            button.text(appointmentLabels[data.appointment]);
        });
    });
});

$('.deleteCandidateAppointment').each((i, e) => {
    const button = $(e);
    button.click(() => {
        const courseId = button.data('course-id');

        const candidateId = button.data('candidate-id');

        $.post(`/course/${courseId}/${candidateId}?delete=1`, {
            courseId: courseId,
            candidateId: candidateId,
        });
    });
});