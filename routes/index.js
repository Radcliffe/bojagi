// JSHint directives
/*jslint node: true */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {'home': true});
});

module.exports = router;
