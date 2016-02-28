var express = require('express');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var port = process.env.PORT || 3000;
var cors = require('cors');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Sets up database and tables, and also exposes getting/setting functions
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


require('../config/passport.js')(passport);

app.use(session({
  secret: 'thumbscheckonprevale',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// app.route('/api/users/create').post(db.createUser);
// app.route('/api/journeys/create').post(db.createJourney);
require('./routes.js')(app, passport);

app.listen(port, function () {
  console.log('The magic is happening on port: ', port);
});

app.get('/', function (req, res) {
  res.send('hello world');
});
