// JSHint directives
/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();

/* Save new level in MongoDB database. */
router.get('/:id', function(req, res) {
    var id = req.params.id;
    var db = req.db;
    var levels = db.collection('levels');
    db.levels.find({_id: parseInt(id)}, function (err, doc) {
        res.render('index', {level: doc});
    });
});

module.exports = router;
