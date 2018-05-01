var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const title = '東京公園ストーリー';
    res.render('index', {
        title: title,
        user: req.user,
    });
});


module.exports = router;