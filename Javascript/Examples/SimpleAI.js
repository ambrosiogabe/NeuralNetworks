let canvas = document.getElementById("ctx")
let ctx = canvas.getContext("2d");
let players = [], numOfPlayers = 80;
let width = 400, height = 600;
let goal = {x: width / 2, y: 10, size: 10};
let obstacles = []
let numOfObstacles = 5;
let generation = 0;
let termVelocity = 4;
let optimalDot = {fitness: 0, nn: null};

function initPlayers() {
  for (let i=0; i < numOfPlayers; i++) {
    let ranX = Math.floor(Math.random() * (width / 2)) + 100;
    let ranY = Math.floor(Math.random() * (height / 3)) + 390;
    let nn = new NeuralNetwork(2, 400, 2);
    players.push({vel: [0, 0], acc: [0, 0], x: ranX, y: ranY, size: 5, nn: nn, dead: false, time: 0, goalMet: false});
  }

  for (let i=0; i < numOfObstacles; i++) {
    let ranX = Math.floor(Math.random() * width);
    let ranWidth = Math.floor(Math.random() * (width / 2));
    let ranY = Math.floor(Math.random() * (2 * (height / 3)));
    obstacles.push({x: ranX, width: ranWidth, y: ranY, height: 5});
  }
}

function calculateFitness(player) {
  let dx = player.x - goal.x;
  let dy = player.y - goal.y;
  let distance = Math.sqrt((dx * dx) + (dy * dy));
  let fitness = (1.0 / distance) / (height * width);
  if (player.goalMet) {
    fitness += 1000 + (1.0 / player.time);
  }
  return fitness;
}

function evolve() {
  generation++;
  let bestFitness = -1;
  let bestPlayer = -1;
  let secondBestFitness = -1;
  let secondBestPlayer = -1;
  for (let i=0; i < numOfPlayers; i++) {
    let fitness = calculateFitness(players[i]);
    if (fitness > bestFitness) {
      bestFitness = fitness;
      bestPlayer = i;
    }

    if (fitness > secondBestFitness && fitness <= bestFitness) {
      secondBestFitness = fitness;
      secondBestPlayer = i;
    }

    if (fitness > optimalDot.fitness) {
      optimalDot.fitness = fitness;
      optimalDot.nn = players[i].nn.copy();
    }
  }

  let breakPoint = Math.floor(numOfPlayers / 3);
  let strongOne = players[bestPlayer];
  let strongOne2 = players[secondBestPlayer];
  let maxMutation = 0.0001;
  let maxMutation2 = 0.1;
  for (let i=0; i < numOfPlayers; i++) {
    if (i < breakPoint) {
      let baby = NeuralNetwork.makeBaby(strongOne.nn, strongOne2.nn);
      if (generation > 4)
        baby.mutate(maxMutation);
      else
        baby.mutate(maxMutation2);
      players[i].nn = baby;
    } else if (i >= breakPoint && i < breakPoint * 2 || generation > 4) {
      let baby = optimalDot.nn.copy();
      baby.mutate(maxMutation);
      players[i].nn = baby;
    } else {
      players[i].nn = new NeuralNetwork(2, 400, 2);
    }
  }
}

function movePlayers() {
  for (let i=0; i < numOfPlayers; i++) {
    if (players[i].dead) continue;
    players[i].time += 1;
    if (players[i].time > 1000) players[i].dead = true;

    let dx = (players[i].x - goal.x) / width;
    let dy = (players[i].y - goal.y) / height;

    let output = players[i].nn.feedforward([players[i].x / width, players[i].y / height]);
    output = output.toArray();

    players[i].acc[0] = output[0][0] * 2 - 1;
    players[i].acc[1] = output[1][0] * 2 - 1;

    players[i].vel[0] += players[i].acc[0];
    players[i].vel[1] += players[i].acc[1];

    if (players[i].vel[0] > termVelocity) players[i].vel[0] = termVelocity;
    if (players[i].vel[1] > termVelocity) players[i].vel[1] = termVelocity;
    if (players[i].vel[0] < -termVelocity) players[i].vel[0] = -termVelocity;
    if (players[i].vel[1] < -termVelocity) players[i].vel[1] = -termVelocity;

    players[i].x += players[i].vel[0];
    players[i].y += players[i].vel[1];

    let player = players[i];
    if (player.x + player.size > width) player.dead = true;
    if (player.x - player.size < 0) player.dead = true;
    if (player.y - player.size < 0) player.dead = true;
    if (player.y + player.size > height) player.dead = true;

    for (let i=0; i < numOfObstacles; i++) {
      let obs = obstacles[i];
      if (player.x + player.size > obs.x && player.x < obs.x + obs.width) {
        if (player.y + player.size > obs.y && player.y < obs.y + obs.height) {
          player.dead = true;
        }
      }
    }

    if (player.x + player.size > goal.x && player.x < goal.x + goal.size) {
      if (player.y + player.size > goal.y && player.y < goal.y + goal.size) {
        player.goalMet = true;
        player.dead = true;
      }
    }
  }

  let allDied = true;
  for (let i=0; i < numOfPlayers; i++) {
    allDied = players[i].dead && allDied;
  }

  if (allDied) {
    evolve();
    for (let i=0; i < numOfPlayers; i++) {
      players[i].dead = false;
      players[i].time = 0;
      players[i].goalMet = false;
      let ranX = Math.floor(Math.random() * (width / 2)) + 100;
      let ranY = Math.floor(Math.random() * (height / 3)) + 390;
      players[i].x = ranX, players[i].y = ranY;
    }
  }
}

function drawPlayers() {
  ctx.fillStyle = "#0000FF";
  for (let i=0; i < numOfPlayers; i++) {
    ctx.fillRect(players[i].x, players[i].y, players[i].size, players[i].size);
  }
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(goal.x, goal.y, goal.size, goal.size);

  ctx.fillStyle = "black";
  for (let i=0; i < numOfObstacles; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
  }
}

function draw() {
  drawPlayers();
}

function update() {
  ctx.clearRect(0, 0, width, height);
  draw();
  movePlayers();
  window.requestAnimationFrame(update);
}


function init() {
  initPlayers();
  update();
}

init();
