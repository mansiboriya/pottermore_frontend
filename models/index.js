var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/Slytherin', function(req, res, next) {
  res.render('slytherin');
});
router.get('/Hufflepuff', function(req, res, next) {
  res.render('hufflepuff');
});
router.get('/Gryffindor', function(req, res, next) {
  res.render('gryffindor');
});
router.get('/Ravenclaw', function(req, res, next) {
  res.render('ravenclaw');
});

module.exports = router;