// Disable line-drawing feature?
let disableLines = 0;

// Disable edge draw reset?
let disableReset = 0;

// Figure out dimensions
let canvasWidth = getComputedStyle(document.querySelector(".canvas")).width;
canvasWidth = canvasWidth.substr(0, canvasWidth.length - 2);
let canvasHeight = getComputedStyle(document.querySelector(".canvas")).height;
canvasHeight = canvasHeight.substr(0, canvasHeight.length - 2);

let squareWidth = getComputedStyle(document.querySelector(".square")).width;
squareWidth = squareWidth.substr(0, squareWidth.length - 2);
let squareHeight = getComputedStyle(document.querySelector(".square")).height;
squareHeight = squareHeight.substr(0, squareHeight.length - 2);

let squareX = Math.round(canvasWidth / squareWidth);
let squareY = Math.round(canvasHeight / squareHeight);

let initialSquares = document.querySelectorAll(".square").length;
let totalSquares = squareX * squareY;

// Add more squares
for(let i = 0; i < totalSquares - initialSquares; i++) {
	element = document.createElement("div");
	element.classList.add("square", "color-5");
	document.querySelector(".canvas").appendChild(element);
}

// Add event listeners for palette
for(element of document.querySelectorAll(".palette-color")) {
	element.addEventListener("click", colorChosen);
}

// Add event listeners for squares and gives them enumerated ids
let squares = document.querySelectorAll(".square");
for(let i = 0; i < squares.length ; i++) {
	squares[i].addEventListener("mouseover", colorMe.bind(null, false));
	squares[i].addEventListener("mousedown", colorMe.bind(null, true));
	// document.styleSheets[0].addRule("#test", "color: rgb(0, 0, 0);", 0);
	squares[i].id = "sq" + i;
}

// Disable dragging within the canvas
document.querySelector(".canvas").ondragstart = function() {return false;}

// Resets the last drawn coords when mouse button is let go.
let lastCoord = [];
document.addEventListener("mouseup", resetCoords);
function resetCoords() {
	lastCoord = [];
}

if(!disableReset) {
	// Resets the last drawn coords when mouse leaves the canvas.
	document.addEventListener("mouseover", resetIfOOB);
	function resetIfOOB(event) {
		let className = event.target.classList[0];
		if(className != "square") {
			lastCoord = [];
		}
	}
}

// Clears the drawing board
document.querySelector(".clear").addEventListener("click", clear)
function clear() {
	for(square of document.querySelectorAll(".square")) {
		square.classList.replace(square.classList[1], document.querySelector(".color-5").classList[1]);
	}
}

// Sets a custom color
document.querySelector(".customColor").addEventListener("click", customColor);
function customColor() {
	color = document.querySelector(".colorInput").value;
	for(i = 0; i < document.styleSheets[0].cssRules.length ; i++) {
		if(document.styleSheets[0].cssRules[i].selectorText == ".color-custom") {
			break;
		}
	}

	switch(String(color).toLowerCase()) {
		case "shit":
			color = "#7B5804";
			break;
		case "blood":
			color = "#8A0303";
	}

	document.styleSheets[0].cssRules[i].style.backgroundColor = color;

	brush = document.querySelector("div.current-brush");
	brush.classList.replace(brush.classList[1], "color-custom");
}

// Load file
document.querySelector(".inputFile").addEventListener("change", loadFile);
function loadFile(event) {
	let reader = new FileReader();
	//console.log(event.target.files[0]);
	reader.onload = fileLoaded;
	reader.readAsText(event.target.files[0]);
}

function fileLoaded(event) {
	let data = event.target.result;
	clear();

	let lines = data.split('\n');

	for(let y = 0; y < lines.length; y++) {
		let pixels = lines[y].split('');
		for(let x = 0; x < pixels.length; x++) {
			sq = getNum([x, y]);
			if(pixels[x] != ' ') {
				square = document.getElementById('sq' + sq);
				square.classList.replace(square.classList[1], document.querySelector("div.current-brush").classList[1]);
			}
		}
	}
	for(line of data.split('\n')) {
		console.log(line);
	}
}

// Returns x,y coordinates of a given square
function getCoords(square) {
	if(String(square).slice(0, 2) == "sq") {
		square = square.substr(2);
	}
	return [square % squareX, Math.floor(square / squareX)];
}

// Takes in coords and returns number of square
function getNum(coords) {
	return squareX * coords[1] + coords[0];
}

// Renders the chosen color in the brush div
function colorChosen(event) {
	brush = document.querySelector("div.current-brush");
	brush.classList.replace(brush.classList[1], event.target.classList[1]);
}

// Draws a square.  If the last square is far away, draw a line between the last one and this one.  This is used if the mouse is moving too quickly.
function colorMe(now, event) {
	if(event.which != 1 && !now) {
		return
	}

	// Draw the square
	event.target.classList.replace(event.target.classList[1], document.querySelector("div.current-brush").classList[1]);

	let currentCoord = getCoords(event.target.id);
	if(lastCoord.length == 0) {
		lastCoord = currentCoord;
	}

	if(!disableLines && (Math.abs(lastCoord[0] - currentCoord[0]) > 1 || Math.abs(lastCoord[1] - currentCoord[1]) > 1)) {
		// Jumping occurred.  Let's draw a line between the 2 points.
		console.log("Jump of " + distance(currentCoord, lastCoord).toFixed(2) + " squares occurred.");
		let line = calcLine(lastCoord[0], lastCoord[1], currentCoord[0], currentCoord[1]);
		line.shift();

		for(coord of line) {
			square = document.getElementById("sq" + getNum(coord));
			square.classList.replace(square.classList[1], document.querySelector("div.current-brush").classList[1]);
		}
	}

	lastCoord = currentCoord;
}

// Calculates distance between 2 points using Pythagorean theorem
function distance(coord1, coord2) {
	return Math.sqrt(Math.abs(coord1[0] - coord2[0])**2 + Math.abs(coord1[1] - coord2[1])**2)
}

// Calculates coordinates for drawing a line between 2 points
function calcLine(x0, y0, x1, y1) {
	let coords = [];
    let ix = x0 < x1 ? 1 : -1, dx = Math.abs(x1 - x0);
    let iy = y0 < y1 ? 1 : -1, dy = Math.abs(y1 - y0);
    let m = Math.max(dx, dy), cx = m >> 1, cy = m >> 1;

    for (i = 0; i < m; i++) {
        coords.push([x0, y0]);
        if ((cx += dx) >= m) { cx -= m; x0 += ix; }
        if ((cy += dy) >= m) { cy -= m; y0 += iy; }
    }

	return coords;
}
