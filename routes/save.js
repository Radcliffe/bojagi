// JSHint directives
/*jslint node: true */

var express = require('express'),
    router = express.Router(),
    filter = require('leo-profanity'),
    db,
    colornames = [
        'lightblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'gold',
        'mediumspringgreen',
        'chocolate',
        'mediumvioletred'],
    boxAttributes = [
        'left',
        'right',
        'bottom',
        'top',
        'x',
        'y',
        'label'];

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
        boxAttributes.forEach(function (attr) {
            boxes[i][attr] = parseInt(boxes[i][attr]);
        });
        let {color, left, right, top, bottom, label, x, y} = boxes[i];
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
