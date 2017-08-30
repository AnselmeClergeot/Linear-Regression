var points = [];

a = 0;
b = 0;

learningRate = 0.0001;

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function predict(x) {
	return a * x + b;
}

function getError(y_expected, x) {
	return y_expected - predict(x);
}

function getGlobalError() {
	var globalError = 0;
	
	points.forEach(function(point) {
		globalError += (1/points.length) * Math.pow(getError(point.y, point.x), 2);
	});

	return globalError;
}

function getDerivatives(point) {

	var error = getError(point.y, point.x);

	return {
		aDerivative : 2 * error * -point.x,
		bDerivative : -2 * error
	};
}

function performRegression() {
		points.forEach(function(point) {

			derivatives = getDerivatives(point);

			a -= derivatives.aDerivative * learningRate;
			b -= derivatives.bDerivative * learningRate;
		});
}

function resetPoints() {
	points = [];
}

function draw() {
	//Drawing background
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, width, height);

	

	//Drawing grid
	ctx.fillStyle = "green";

	for(var x = width/2; x < width; x += 1/scale) {
		ctx.fillRect(x, 0, 1, height);
		ctx.fillRect(width - x, 0, 1, height);
	}

	for(var y = height/2; y < height; y += 1/scale) {
		ctx.fillRect(0, y, width, 1);
		ctx.fillRect(0, height-y, width, 1);
	}

	//Drawing axis
	ctx.fillStyle = "red";


	ctx.fillRect(0, height/2, width, 1);
	ctx.fillRect(width/2, 0, 1, height);

	//Drawing points
	ctx.fillStyle = "black";
	points.forEach(function(point) {
		pointScreen = cartesianToScreen(point);
		console.log(pointScreen.x + ", " + pointScreen.y);
		ctx.beginPath();
		ctx.arc(pointScreen.x, pointScreen.y, 2, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	});

	var xStart = (-width/2) * scale;
	var yStart = predict(xStart)
	var xEnd = width/2 * scale;
	var yEnd = predict(xEnd);

	start = cartesianToScreen(new Point(xStart, yStart));
	end = cartesianToScreen(new Point(xEnd, yEnd));

	//Drawing line of equation y = ax + b
	ctx.strokeStyle = "blue";
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x, end.y);
	ctx.stroke();
	ctx.closePath();
}

function screenToCartesian(point) {
	return new Point((point.x - width/2) * scale, (height/2-point.y) * scale);
}

function cartesianToScreen(point) {
	return new Point((point.x + width/2 * scale) / scale, (-point.y + height/2 * scale) / scale)
}


var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");

canvas.onclick = function(e) {
	cartesian = screenToCartesian(new Point(e.clientX, e.clientY));
	points.push(cartesian);
}

function getEquation(precision) {
	return "y = " + Math.round(a * precision)/precision + "x + " + Math.round(b * precision)/precision;
}

setInterval(function() {

	for(var i = 0; i < 10; i++)
		performRegression();
	draw();

	equationBox.value = getEquation(precision);
	

}, 1000/60);

precision = Math.pow(10, 3);
scale = 1/40;

equationBox = document.getElementById("equation");

draw();