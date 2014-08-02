// JSHint directives
/*jslint node: true */

"use strict";

var express = require('express');
var router = express.Router();

/* Display list of user-created levels */
router.get('/', function(req, res) {
    var db = req.db;
    // db.foo.find().sort({_id:1});
    db.levels.find().sort({_id:-1}).limit(50, function (e, doc) {
        res.render('list', {levels: doc, list: true});
    });
});

module.exports = router;