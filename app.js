var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const errorHandler = require('./middleware/errorHandler.middleware');

//route modules
var ownerRouter = require('./routes/owner.routes');
var serviceRouter = require('./routes/service.routes');
var listingRouter = require('./routes/listing.routes');
var houseRouter = require('./routes/house.routes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/owner', ownerRouter);
app.use('/service', serviceRouter);
app.use('/listing', listingRouter);
app.use('/house' , houseRouter);

// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
  next(createError(404, 'what??? wrong API endpoint bozo, this one dont exist'));
});

app.use(errorHandler); 

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
