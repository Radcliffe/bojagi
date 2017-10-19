// JSHint directives
/*jslint node: true */

"use strict";

var express = require('express');
var router = express.Router();

/* Display list of user-created levels */
router.get('/', function(req, res) {
    let db = req.db;
    db.counters.find(function (err, doc) {
        let seq = doc[0].seq;
        let offset = parseInt(req.query.offset) || seq;
        let newer = Math.min(offset + 50, seq);
        let older = Math.max(offset - 50, 50);
        db.levels
          .find({_id: {$lte: offset}})
          .sort({_id: -1})
          .limit(50, function (e, levels) {
             res.render('list', {levels, older, newer, seq});
          });
    });
});

module.exports = router;