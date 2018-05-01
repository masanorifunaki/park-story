'use strict';
const express = require('express');
const router = express.Router();
const auth = require('http-auth');

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
    console.log(req.body); // TODO 予定と候補を保存する実装をする
    res.redirect('/');
});

module.exports = router;