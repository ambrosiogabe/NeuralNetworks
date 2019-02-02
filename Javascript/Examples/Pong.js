let canvas = document.getElementById("ctx");
let ctx = canvas.getContext("2d");
let width = 600, height = 400;
let terminalVelocity = 8, maxBounceAngle = Math.PI / 3, ballSpeed = 8, padding = 16;
let p1 = {x: 0, y: 0, width: 8, height: 70, acc: 0, vel: 0, moving: false, nn: null, score: 0, fitness: 0, numOfHits: 0};
let p2 = {x: 0, y: 0, width: 8, height: 70, acc: 0, vel: 0, moving: false, nn: null, score: 0, fitness: 0, numOfHits: 0};
let ball = {x: 0, y: 0, vel: [0, 0], size: 8};
let generation = 0;
let optimalP1 = {nn: null, fitness: -1000};
let optimalP2 = {nn: null, fitness: -1000};
let inputNodes = 5, hiddenNodes = 800, outputNodes = 1;

function think() {
  let p1Output = p1.nn.feedforward([ball.vel[0], ball.vel[1], ball.x, ball.y, p1.y]);
  let p2Output = p2.nn.feedforward([ball.vel[0], ball.vel[1], ball.x, ball.y, p2.y]);
  //p1.vel = p1Output.data[0][0] * 8 - 4;
  p2.vel = p2Output.data[0][0] * 8 - 4;
}

function evolve() {
  generation++;
  console.log(generation);
  p1.fitness = ((p1.score - p2.score) / 2) + Math.exp(p1.numOfHits);
  p2.fitness = ((p2.score - p1.score) / 2) + Math.exp(p2.numOfHits);

  if (p1.fitness > optimalP1.fitness) {
    optimalP1.fitness = p1.fitness;
    optimalP1.nn = p1.nn.copy();
  }

  if (p2.fitness > optimalP2.fitness) {
    optimalP2.fitness = p2.fitness;
    optimalP2.nn = p2.nn.copy();
  }

  p1.nn = optimalP1.nn.copy();
  if (generation < 6) p1.nn.mutate(0.1);
  else p1.nn.mutate(0.001);

  p2.nn = optimalP2.nn.copy();
  if (generation < 6) p2.nn.mutate(0.1);
  else p2.nn.mutate(0.001);

  p1.score = 0;
  p2.score = 0;
  p1.numOfHits = 0;
  p2.numOfHits = 0;
  p1.fitness = 0;
  p2.fitness = 0;
  p1.y = height / 2;
  p2.y = height / 2;
}

function calculateBallExitSpeed(player) {
  let intersectionY = (player.y + (player.height / 2)) - ball.y;
  let normalIntersectionY = intersectionY / (player.height / 2);
  let bounceAngle = normalIntersectionY * maxBounceAngle;
  ball.vel[0] = ballSpeed * Math.cos(bounceAngle);
  ball.vel[1] = ballSpeed * (-Math.sin(bounceAngle));
}

function checkCollisions() {
  if (ball.y + ball.size > height - padding) {
    ball.y = height - ball.size - padding;
    ball.vel[1] = -ball.vel[1];
  }

  if (ball.y < padding) {
    ball.y = padding;
    ball.vel[1] = -ball.vel[1];
  }

  if (ball.y + ball.size > p1.y && ball.y < p1.y + p1.height) {
    if (ball.x < p1.x + p1.width) {
      p1.numOfHits++;
      ball.x = p1.x + p1.width;
      ball.vel[0] = -ball.vel[0];
      calculateBallExitSpeed(p1);
    }
  }

  if (ball.y + ball.size > p2.y && ball.y < p2.y + p2.height) {
    if (ball.x + ball.size > p2.x) {
      p2.numOfHits++;
      ball.x = p2.x - ball.size;
      calculateBallExitSpeed(p2);
      ball.vel[0] = -ball.vel[0];
    }
  }

  if (ball.x < 0) {
    p2.score++;
    ball.x = (width / 2);
    ball.y = (height / 2) + Math.floor(Math.random() * 100 - 50);
    ball.vel[0] = 6;
    ball.vel[1] = Math.floor(Math.random() * 4) + 2;
    if (p2.score > 1) evolve();
  }

  if (ball.x + ball.size > width) {
    p1.score++;
    ball.x = (width / 2);
    ball.y = (height / 2) + Math.floor(Math.random() * 100 - 50);
    ball.vel[0] = -6;
    ball.vel[1] = -Math.floor(Math.random() * 4) + 2;
    if (p1.score > 1) evolve();
  }

  if (p1.y + p1.height > height - padding) p1.y = height - p1.height - padding;
  if (p2.y + p2.height > height - padding) p2.y = height - p2.height - padding;
  if (p1.y < padding) p1.y = padding;
  if (p2.y < padding) p2.y = padding;
}

function move() {
  p1.vel += p1.acc;
  p2.vel += p2.acc;

  if (p1.moving) {
    if (p1.vel > terminalVelocity) p1.vel = terminalVelocity;
    if (p1.vel < -terminalVelocity) p1.vel = -terminalVelocity;
  } else {
    if (p1.vel > 0 && p1.acc > 0) p1.vel = 0;
    if (p1.vel < 0 && p1.acc < 0) p1. vel = 0;
  }
  if (p2.moving) {
    if (p2.vel > terminalVelocity) p2.vel = terminalVelocity;
    if (p2.vel < -terminalVelocity) p2.vel = -terminalVelocity;
  } else {
    if (p2.vel > 0 && p2.acc > 0) p2.vel = 0;
    if (p2.vel < 0 && p2.acc < 0) p2.vel = 0;
  }

  p1.y += p1.vel;
  p2.y += p2.vel;

  ball.x += ball.vel[0];
  ball.y += ball.vel[1];
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.fillRect(5, 8, width - 10, 6);
  ctx.fillRect(5, height - 16, width - 10, 6);
  let stripes = 10;
  for (let i=0; i < stripes; i++) {
    ctx.fillRect((width / 2) - 3, (i * 40) + 8, 6, 20);
  }

  ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
  ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

  ctx.font = "30px Courier"
  ctx.fillText("" + p1.score, (width / 2) - 40, 50);
  ctx.fillText("" + p2.score, (width / 2) + 40, 50);
}

function update() {
  draw();
  move();
  checkCollisions();
  think();
  window.requestAnimationFrame(update);
}

function init() {
  p1.x = 10;
  p2.x = width - 10;
  p1.y = Math.floor(height / 2) - Math.floor(p1.height / 2);
  p2.y = Math.floor(height / 2) - Math.floor(p2.height / 2);
  p1.nn = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
  p2.nn = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);

  let ranY = Math.floor(Math.random() * (height / 2)) + 10;
  ball.y = ranY;
  ball.x = Math.floor(width / 2);

  ball.vel[0] = 6;
  ball.vel[1] = 3.4;
  update();
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 38: // up arrow
      p1.acc = -2;
      p1.moving = true;
      break;
    case 40: // down arrow
      p1.acc = 2;
      p1.moving = true;
      break;
    case 87: // w key
      p2.acc = -2;
      p2.moving = true;
      break;
    case 83: // s key
      p2.acc = 2;
      p2.moving = true;
      break;
    default:
      break;
  }
}

document.onkeyup = function(e) {
  switch (e.keyCode) {
    case 38: // up arrow
      p1.acc = 2;
      p1.moving = false;
      break;
    case 40: // down arrow
      p1.acc = -2;
      p1.moving = false;
      break;
    case 87: // w key
      p2.acc = 2;
      p2.moving = false;
      break;
    case 83: // s key
      p2.acc = -2;
      p2.moving = false;
      break;
    default:
      break;
  }
}

init();
