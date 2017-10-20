// JSHint directives
/*jslint node: true */

var express = require('express');
var router = express.Router();
var Filter = require('bad-words'),
    filter = new Filter();
filter.removeWords('title');
var db;

var colornames = [
            'lightblue',
            'mediumorchid',
            'mediumpurple',
            'mediumseagreen',
            'gold',
            'mediumspringgreen',
            'chocolate',
            'mediumvioletred'];

function validate_level(level) {
    let {rows, cols, boxes, author, title, created} = level;
    rows = parseInt(rows);
    cols = parseInt(cols);
    if (isNaN(rows) || rows < 1 || rows > 40) return false;
    if (isNaN(cols) || cols < 1 || cols > 40) return false;
    if (author.length > 24 || title.length > 32) return false;
    if (isNaN(Date.parse(created))) return false;
    if (!Array.isArray(boxes) || boxes.length == 0 || boxes.length >= 1600) return false;

    for (let i = 0; i < boxes.length; i++) {
        let {color, left, right, top, bottom, label, x, y} = boxes[i];
        left = parseInt(left);
        right = parseInt(right);
        top = parseInt(top);
        bottom = parseInt(bottom);
        x = parseInt(x);
        y = parseInt(y);
        label = parseInt(label);
        let valid = (colornames.indexOf(color) > -1)
            && (0 <= left) && (left <= x) && (x <= right) && (right < cols)
            && (0 <= top) && (top <= y) && (y <= bottom) && (bottom < rows)
            && (label == (right - left + 1) * (bottom - top + 1));
        if (!valid) return false;
        // Check for collisions.
        for (let j = 0; j < i; j++) {
            let b = boxes[j];
            if ((left <= b.right) && (b.left <= right)
                && (top <= b.bottom) && (b.top <= bottom)) {
                    return false;
                }
        }
    }
    return true;
}


function getNextSequence(newdoc) {
    if (!validate_level(newdoc)) return;
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
    let newdoc = {};
    newdoc.rows = parseInt(req.body.rows);
    newdoc.cols = parseInt(req.body.cols);
    newdoc.boxes = req.body.boxes;
    newdoc.author = filter.clean(req.body.author);
    newdoc.title = filter.clean(req.body.title);
    newdoc.created = req.body.created;
    if (typeof(newdoc.boxes) == 'string')
        newdoc.boxes = JSON.parse(newdoc.boxes);
    getNextSequence(newdoc);
});

module.exports = router;
