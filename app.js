var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var https = require('https');
const fs = require('fs');
const http = require('http');

var indexRouter = require('./src/routes/index');
var pictureRoute = require('./src/routes/pictures');

var app = express();
var cors = require('cors')

const privateKey = fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/handsomeio.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images/photos')));

app.use('/', indexRouter);
app.use('/pictures', pictureRoute);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8888, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(8443, () => {
	console.log('HTTPS Server running on port 443');
});
// app.listen(8888, function(){
   // console.log('Listening on port ' + this.address().port); //Listening on port 8888
// });
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
