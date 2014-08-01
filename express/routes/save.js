// JSHint directives
/*jslint node: true */

var express = require('express');
var router = express.Router();

var db;

function getNextSequence(newdoc) {
    db.counters.findAndModify(
        {
            query: { _id: 'levels' },
            update: { $inc: { seq: 1 } },
            new: true
        }, 
        function(err, doc, lastErrorObject) {
            newdoc._id = doc.seq;
            db.levels.save(newdoc);
        }  
    );
}

/* Save new level in MongoDB database. */
router.post('/', function(req, res) {
    db = req.db;
    var newdoc = {};
    newdoc.rows = parseInt(req.body.rows);
    newdoc.cols = parseInt(req.body.cols);
    newdoc.boxes = req.body.boxes;
    newdoc.author = req.body.author;
    newdoc.title = req.body.title;
    newdoc.author = req.body.author;
    newdoc.created = req.body.created;
    if (typeof(newdoc.boxes) == 'string')
        newdoc.boxes = JSON.parse(newdoc.boxes);
    getNextSequence(newdoc);
});

module.exports = router;
