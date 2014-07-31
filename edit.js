// JSHint directives
/*jslint node: true */
/*global console */
/*global $*/
/*global document */

"use strict";

$(document).ready(function () {
    var rows = 16;
    var cols = 16;
    var cellSize = 30;
    var boxCounter = 0;
    
    $(".json").hide();
    $(".times").hide();
    
    var canvas, context, i, boxes, newbox = {}, mouseDown = false;
    canvas = document.getElementById("canvas");
    canvas.setAttribute("height", rows * cellSize + 20);
    canvas.setAttribute("width", cols * cellSize + 20);
    context = canvas.getContext("2d");

    boxes = [];
    
    function drawGrid() {
        context.fillStyle = "steelblue";
        var i, j;
        for (i = 0; i <= cols; i += 1) {
            for (j = 0; j <= rows; j += 1) {
                context.fillRect(10 + cellSize * i, 10 + cellSize * j, 3, 3);
            }
        }
    }
    
    function getColor() {
        var colornames = [
            'lightblue',
            'mediumorchid',
            'mediumpurple',
            'mediumseagreen',
            'gold',
            'mediumspringgreen',
            'chocolate',
            'mediumvioletred'];
        return colornames[boxCounter++ % colornames.length];
    }
    
    function drawBox(box) {
        context.fillStyle = box.color;
        context.fillRect(13 + box.left * cellSize, 
                         13 + box.top * cellSize,
                         cellSize * (box.right - box.left + 1) - 3,
                         cellSize * (box.bottom - box.top + 1) - 3
        );
    }
    
    function drawBoxes() {
        var i;
        for (i = 0; i < boxes.length; i += 1)
            drawBox(boxes[i]);
    }
    
    function writeNumber(box) {
        context.fillStyle = "black";
        context.font = "16px Arial";
        var textWidth = context.measureText(box.label).width;
        context.fillText(box.label, 12 + cellSize * (box.x + 0.5) - textWidth / 2, 
                         18 + cellSize * (box.y + 0.5));
    }
    
    function drawLabels() {
        var i;
        for (i = 0; i < boxes.length; i += 1)
            if ('label' in boxes[i])
                writeNumber(boxes[i]);
    }
    
    function times(box) {
        var a = box.right - box.left + 1;
        var b = box.bottom - box.top + 1;
        $(".times").text(a + " × " + b);
    }
    
    function clip(rows, cols) {
        var newboxes = [];
        var i;
        for (i = 0; i < boxes.length; i++) {
            if (boxes[i].right < cols && boxes[i].bottom < rows) {
                newboxes.push(boxes[i]);
            }
        }
        boxes = newboxes;
    }
    
    function validate(box) {
        var index = -1;
        var i, j;
        
        // Check collision
        for (i = 0; i < boxes.length; i++) {
            if (box.right >= boxes[i].left && 
                boxes[i].right >= box.left && 
                box.bottom >= boxes[i].top && 
                boxes[i].bottom >= box.top) {
                    if (box.top == box.bottom && box.left == box.right) {
                        if (box.left == boxes[i].x && box.top == boxes[i].y) {
                            boxes.splice(i, 1);
                        } else {
                            boxes[i].label = area(boxes[i]);
                            boxes[i].x = box.left;
                            boxes[i].y = box.top;
                        }
                    }
                        
                    return false;
            }
        }
        box.color = getColor(boxes.length);
        box.label = area(box);
        boxes.push(box);
        return true;
    }
    
    function area(box) {
        return (box.bottom - box.top + 1) * (box.right - box.left + 1);
    }
    
    function reset(box) {
        box.right = box.left = box.x;
        box.top = box.bottom = box.y;
        box.set = false;
    }
    
    function limit(x, lower, upper) {
        if (x <= lower)
            return lower;
        if (x >= upper)
            return upper;
        return x;
    }
    
    function between(x, lower, upper) {
        return (lower <= x && x <= upper);
    }
            
    function getMousePos(canvas, e) {
        var x, y, rect;
        rect = canvas.getBoundingClientRect();
        x = limit(Math.floor((e.clientX - rect.left - 10) / cellSize), 0, cols-1);
        y = limit(Math.floor((e.clientY - rect.top - 10) / cellSize), 0, rows-1);        
        return {x : x, y : y};
    }
    
    
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function redraw() {
        clearCanvas();
        drawBoxes();
        if ('x' in newbox) drawBox(newbox);
        drawGrid();
        drawLabels();
        // makeJSON();
    }
    
    function makeJSON() {
        var j = {};
        j.rows = rows;
        j.cols = cols;
        j.boxes = boxes;
        $("#json").text('level = ' + JSON.stringify(j) + ';');
    }
    
    // Event Listeners
    
    $("#canvas").on("mousedown", function (e) {
        if (!mouseDown) {   
            mouseDown = true;
            var pos = getMousePos(canvas, e);
            newbox = {};
            newbox.x = newbox.left = newbox.right = pos.x;
            newbox.y = newbox.top = newbox.bottom = pos.y;
            newbox.color = "pink";
            times(newbox);
            $(".times").show();
            redraw();
        }
    });
    
    $("#canvas").on("mousemove", function (e) {
        if (mouseDown) {
            var pos = getMousePos(canvas, e);
            newbox.right = Math.max(newbox.x, pos.x);
            newbox.left = Math.min(newbox.x, pos.x);
            newbox.top = Math.min(newbox.y, pos.y);
            newbox.bottom = Math.max(newbox.y, pos.y);
            times(newbox);
            redraw();
        }
    });
    
    $("#canvas").on("mouseup", function (e) {
        if (mouseDown) {
            mouseDown = false;
            validate(newbox);
            newbox = { };
            $(".times").hide();
            redraw();
            
        }
    });
    
    $("#rows").change(function() {
        var newrows = parseInt($(this).val());
        if (newrows < rows) clip(newrows, cols);
        rows = newrows;
        canvas.setAttribute("height", rows * cellSize + 20);
        redraw();
    });
    
    $("#cols").change(function() {
        var newcols = parseInt($(this).val());
        if (newcols < cols) clip(rows, newcols);
        cols = newcols;
        canvas.setAttribute("width", cols * cellSize + 20);
        redraw();
    });
                     
            
    redraw();

});