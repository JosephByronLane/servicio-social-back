var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const errorHandler = require('./middleware/errorHandler.middleware');
const cors = require('cors');
//route modules
var ownerRouter = require('./routes/owner.routes');
var serviceRouter = require('./routes/service.routes');
var listingRouter = require('./routes/listing.routes');
var houseRouter = require('./routes/house.routes');
var imageRouter = require('./routes/image.routes');
var emailRouter = require('./routes/email.routes');
var app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.options('*', cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
app.use('/image', imageRouter);
app.use('/email', emailRouter);

app.get('/', (req, res) => {
  res.render('index');
});

//TODO: if this list grows to big we move them to their own file for easier managing
app.get('/deletion.success.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/deletion.success.html'));
});

// Route to serve deletion-error.html
app.get('/deletion.error.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/deletion.error.html'));
});



// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
  res.status(404).json({ message: 'what??? wrong API endpoint bozo, this one dont exist' });
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
