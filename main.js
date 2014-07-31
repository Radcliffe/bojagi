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
    
    $(".win").hide();
    $(".times").hide();
    
    var canvas, context, i, boxes, newbox = {}, mouseDown = false;
    canvas = document.getElementById("canvas");
    canvas.setAttribute("height", rows * cellSize + 20);
    canvas.setAttribute("width", cols * cellSize + 20);
    context = canvas.getContext("2d");

    boxes = [];
    
    function initializeBoxes() {
        var i;
        boxes[0] = {x: 11, y: 0, label: 36};
        boxes[1] = {x: 7, y: 2, label: 24};
        boxes[2] = {x: 6, y: 3, label: 4};
        boxes[3] = {x: 3, y: 5, label: 24};
        boxes[4] = {x: 14, y: 6, label: 60};
        boxes[5] = {x: 7, y: 7, label: 8};
        boxes[6] = {x: 8, y: 8, label: 18};
        boxes[7] = {x: 1, y: 9, label: 26};
        boxes[8] = {x: 6, y: 12, label: 56};
        for (i = 0; i < boxes.length; i++) {
            boxes[i].color = getColor(i);
            boxes[i].left = boxes[i].right = boxes[i].x;
            boxes[i].top = boxes[i].bottom = boxes[i].y;
            boxes[i].set = false;
        }
    }
    
    function drawGrid() {
        context.fillStyle = "steelblue";
        var i, j;
        for (i = 0; i <= cols; i += 1) {
            for (j = 0; j <= rows; j += 1) {
                context.fillRect(10 + cellSize * i, 10 + cellSize * j, 3, 3);
            }
        }
    }
    
    function getColor(i) {
        var colornames = [
            'lightblue',
            'mediumorchid',
            'mediumpurple',
            'mediumseagreen',
            'gold',
            'mediumspringgreen',
            'chocolate',
            'mediumvioletred'];
        return colornames[i % colornames.length];
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
            writeNumber(boxes[i]);
    }
    
    function times(box) {
        var a = box.right - box.left + 1;
        var b = box.bottom - box.top + 1;
        $(".times").text(a + " × " + b);
    }
        
    function validate(box) {
        var index = -1;
        var i, j;
        
        // Search for unique label inside box
        for (i = 0; i < boxes.length; i++) {
            if (between(boxes[i].x, box.left, box.right) &&
            between(boxes[i].y, box.top, box.bottom)) {
                if (index !== -1) {
                    return false;
                }
                index = i;
            }
        }
        if (index == -1) {
            return false;
        }
        
        // Check area
        if (boxes[index].label != (box.right - box.left + 1) *
                                  (box.bottom - box.top + 1)) {
            reset(boxes[index]);
            return false;
        }
        
        // Check collision
        for (i = 0; i < boxes.length; i++) {
            if (i != index && 
                box.right >= boxes[i].left && 
                boxes[i].right >= box.left && 
                box.bottom >= boxes[i].top && 
                boxes[i].bottom >= box.top) {
                    reset(boxes[index]);
                    return false;
            }
        }
        
        boxes[index].left = box.left;
        boxes[index].right = box.right;
        boxes[index].top = box.top;
        boxes[index].bottom = box.bottom;
        boxes[index].set = true;
        return true;
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
        if (!mouseDown)
            checkWin();
    }
    
    function checkWin() {
        var i;
        for (i = 0; i < boxes.length; i++) {
            if (!boxes[i].set) {
                $(".win").hide();
                return false;
            }
        }
        $(".times").text("Congratulations!");
        $(".times").show();
        return true;
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
    
    initializeBoxes();
    redraw();

});