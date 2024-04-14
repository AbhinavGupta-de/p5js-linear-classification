let points = []; // Array to store points
let lineCoefficients = {}; // Object to store coefficients of classification line
let guessedLine = {}; // Object to store coefficients of guessed line
let guessedLinePoints = []; // Array to store points of guessed line
let isGuessed = false; // Boolean to check if the user has guessed the line

function setup() {
	createCanvas(800, 600);
}

function draw() {
	background(0);

	noStroke();
	for (let point of points) {
		let distance = calculateDistance(point);
		let colorValue = map(distance, 0, height / 2, 255, 0);
		fill(255 - colorValue, colorValue, colorValue / 10);
		ellipse(point.x, point.y, 10, 10);
	}

	if (points.length >= 15) {
		calculateLine();
		isGuessed = true;
		guessLine();
	}
	noStroke();
	fill(255);
	textAlign(CENTER);
	textSize(20);
	let remainingPoints = 15 - points.length;
	text(`Points remaining: ${remainingPoints}`, width / 2, height - 20);
}

function guessLine() {
	if (guessedLinePoints.length < 2) {
		return;
	}

	let x1 = guessedLinePoints[0].x;
	let y1 = guessedLinePoints[0].y;
	let x2 = guessedLinePoints[1].x;
	let y2 = guessedLinePoints[1].y;
	let m = (y2 - y1) / (x2 - x1);
	let b = y1 - m * x1;
	guessedLine.m = m;
	guessedLine.b = b;

	stroke(0, 0, 255);
	strokeWeight(2);
	line(x1, y1, x2, y2);

	drawLine();

	if (guessedLine.m !== undefined && guessedLine.b !== undefined) {
		let score = Math.sqrt(
			Math.abs(
				Math.pow(lineCoefficients.b - guessedLine.b, 2) -
					Math.pow(lineCoefficients.m - guessedLine.m, 2)
			)
		);

		noStroke();
		textSize(20);
		text(`Score: ${score}`, width / 2, height - 50);
	}
}

function mousePressed() {
	let point = createVector(mouseX, mouseY);
	if (isGuessed) {
		guessedLinePoints.push(point);
	} else {
		points.push(point);
	}
}

function calculateLine() {
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
	stroke(255, 0, 0);
	strokeWeight(2);
	let x1 = 0;
	let y1 = lineCoefficients.m * x1 + lineCoefficients.b;
	let x2 = width;
	let y2 = lineCoefficients.m * x2 + lineCoefficients.b;
	line(x1, y1, x2, y2);
}

function calculateDistance(point) {
	let numerator = abs(
		lineCoefficients.m * point.x - point.y + lineCoefficients.b
	);
	let denominator = sqrt(lineCoefficients.m * lineCoefficients.m + 1);
	return numerator / denominator;
}
