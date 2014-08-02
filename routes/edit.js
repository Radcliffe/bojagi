// JSHint directives
/*jslint node: true */

var express = require('express');
var router = express.Router();

/* GET level editor. */
router.get('/', function(req, res) {
  res.render('edit', { 'create' : true });
});

module.exports = router;
