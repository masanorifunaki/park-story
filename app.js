var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');

// モデルの読み込み
var User = require('./models/user');
var Course = require('./models/course');
var Candidate = require('./models/candidate');
var Appointment = require('./models/appointment');
var Board = require('./models/board');

User.sync().then(() => {
    Course.sync().then(() => {
        Candidate.belongsTo(Course, {
            foreignKey: 'courseId'
        });
        Appointment.belongsTo(User, {
            foreignKey: 'userId'
        });
        Candidate.sync().then(() => {
            Appointment.belongsTo(Candidate, {
                foreignKey: 'candidateId'
            });
            Appointment.belongsTo(Course, {
                foreignKey: 'courseId'
            });
            Appointment.sync().then(() => {
                Board.belongsTo(Appointment, {
                    foreignKey: 'candidateId'
                });
                Board.sync();
            });
        });
    });
});

var FaceBookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new FaceBookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/facebook/callback' : 'https://mfunaki.jp:8000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
},
function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        User.upsert({
            userId: profile.id,
            userName: profile.displayName,
            userImg: profile.photos[0].value
        }).then(() => {
            done(null, profile);
        });
    });
}));

var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var course = require('./routes/course');
var appointment = require('./routes/appointment');
var mypage = require('./routes/mypage');


var app = express();

app.use(helmet());

app.use(session({
    secret: '417cce55dcfcfaeb',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', mypage);
app.use('/login', login);
app.use('/logout', logout);
app.use('/course', course);
app.use('/course', appointment);

app.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['public_profile']
    }),
    function (req, res) {});


app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        var loginFrom = req.cookies.loginFrom;
        // オープンリダイレクタ脆弱性対策
        if (loginFrom &&
      loginFrom.indexOf('http://') < 0 &&
      loginFrom.indexOf('https://') < 0) {
            res.clearCookie('loginFrom');
            res.redirect(loginFrom);
        } else {
            res.redirect('/');
        }
    });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;