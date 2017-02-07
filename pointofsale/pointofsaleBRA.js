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
app.set('views', __dirname + '/views/posbraviews')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

cities = ["Córdoba","Buenos Aires","Rio de Janeiro","Brasilia","New York","Los Angeles"]

app.get('/', function (req, res) {
  res.render('index',
  { title : 'POS Bra', cities: cities}
  )
})
app.listen(3001)
