/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views/posargviews')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

cities = ["Río Cuarto", "Córdoba", "Buenos Aires", "Rosario", "Rio de Janeiro", "Brasilia","New York", "Los Angeles"]

app.get('/', function (req, res) {
  res.render('index',
  { title : 'POS Arg', cities: cities}
  )
})
app.listen(3000)
