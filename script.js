let points = []; // Array to store points
let lineCoefficients = {}; // Object to store coefficients of classification line

function setup() {
	createCanvas(800, 600);
}

function draw() {
	background(0);

	// Draw points with color based on distance from the line
	noStroke();
	for (let point of points) {
		let distance = calculateDistance(point);
		let colorValue = map(distance, 0, height / 2, 255, 0); // Map distance to color value
		fill(255 - colorValue, colorValue, colorValue / 10); // Green to red gradient
		ellipse(point.x, point.y, 10, 10);
	}

	// Calculate and draw classification line
	if (points.length >= 15) {
		calculateLine();
		drawLine();
	}
}

function mousePressed() {
	// Insert point at mouse coordinates
	let point = createVector(mouseX, mouseY);
	points.push(point);
}

function calculateLine() {
	// Calculate coefficients of classification line using linear regression

	let xSum = 0;
	let ySum = 0;
	let xySum = 0;
	let xxSum = 0;

	for (let point of points) {
		xSum += point.x;
		ySum += point.y;
		xySum += point.x * point.y;
		xxSum += point.x * point.x;
	}

	let n = points.length;
	let m = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
	let b = (ySum - m * xSum) / n;

	lineCoefficients.m = m;
	lineCoefficients.b = b;
}

function drawLine() {
	// Draw classification line
	stroke(255, 0, 0);
	strokeWeight(2);
	let x1 = 0;
	let y1 = lineCoefficients.m * x1 + lineCoefficients.b;
	let x2 = width;
	let y2 = lineCoefficients.m * x2 + lineCoefficients.b;
	line(x1, y1, x2, y2);
}

function calculateDistance(point) {
	// Calculate distance of a point from the classification line using the formula for the distance of a point from a line
	let numerator = abs(
		lineCoefficients.m * point.x - point.y + lineCoefficients.b
	);
	let denominator = sqrt(lineCoefficients.m * lineCoefficients.m + 1);
	return numerator / denominator;
}
