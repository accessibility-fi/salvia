'use strict'
var debug = require('debug')
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const reportRouter = require('./routes/report')
const salviaRouter = require('./routes/salvia')

const i18n = require('i18n')

var server
var app = express()

//use .env to get load local env variables

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

i18n.configure({
  locales: ['fi', 'en', 'sv'],
  directory: path.join(__dirname, 'locales'),
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'salvia-ui', 'build')))
app.use(express.static(path.join(__dirname, 'public')))

//routes

app.use('/api/reports', reportRouter)
app.use('/api/salvia', salviaRouter)

//all other requests go to react app
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'salvia-ui', 'build', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err,
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {},
  })
})

app.set('port', process.env.PORT || 3001)

exports.listen = function () {
  server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port)
    console.log('Express server listening on port ' + server.address().port)
  })
}

exports.close = function () {
  server.close(() => {
    debug('Server stopped.')
  })
}

this.listen()
