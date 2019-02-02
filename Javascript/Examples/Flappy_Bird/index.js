//uncomment lines 249 and 620 to see the evolution in process, i currently have the optimal bird hardcoded in.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 600; var height = 800;
var player = {x: 20, y: 400, width: 40, acceleration: 1, velocity: 1};
var numOfHiddenLayers = 8;
var optimalBird = new NeuralNetwork(4, numOfHiddenLayers, 1);//{w0: [0, 0, 0, 0], w1: [0, 0, 0, 0, 0, 0], b0: [0, 0, 0, 0, 0, 0], b1: [0]};
var bestOverallDistance = 0;


/* OPTIMAL BIRD THUS FAR
b0: (6) [-0.7528560675439034, -0.8445556870322194, -0.6913863561227793, -0.8254894149709405, 0.9476461021675304, 0.9046001427132115]
b1: [-0.15448244252205434]
w0: (4) [-0.7830956934649517, -1, -0.7544251529209858, 0.4315041724488036]
w1: (6) [0.49440730689848605, 0.7835952291286791, -0.4020624544940733, 0.9512777912635462, -0.886652157332678, 0.09765672105535614]

*/

var numOfBirds = 30;
var birds = [];
for (var i=0; i < numOfBirds; i++) {
  birds.push({x: 20, y: 380, width: 40, acceleration: 1, velocity: 1, dx: 0, dy: 0, neuralNetwork: null, died: false,
  jump: false, distanceTraveled: 0});
}

var nextPipeY = 0;
var lastGoodJump = 0;

var doJump = false;
var pipeWidth = 70, pipeSpaceX = 300, pipeSpaceY = 170, pipeHeight = 800;
var pipeSpeed = 2.5, pipeAcceleration = 0.001;
var maxVelocity = 8, minVelocity = -14, jumpForce = -40, acceleration = 1;
var died = false;
var pipes = [];
var numOfPipes = 3;
var score = 0;
var iOne, iTwo, iThree, iFour, iFive, iSix,
iSeven, iEight, iNine, iZero, iRedPipe, iGreenPipe,
iGreenPipe1, iBase, iBgDay, iBgNight, iBase, iGameOver,
iYellowBird1, iYellowBird2, iYellowBird3, iMessage;
var baseImages = [0, width];
var bgImages = [0, width];
var playing = true;
var highestScore = 0;
var drawDay = true, doingFlap = false;
var animFrame = 0;
var generation = 0;

function loadImage(src) {
  var image = new Image();
  image.src = src;
  image.onload = function() {
    console.log("Loaded..." + src)
  }
  return image;
}

function loadAssets() {
  iZero = loadImage("assets/0.png");
  iOne = loadImage("assets/1.png");
  iTwo = loadImage("assets/2.png");
  iThree = loadImage("assets/3.png");
  iFour = loadImage("assets/4.png");
  iFive = loadImage("assets/5.png");
  iSix = loadImage("assets/6.png");
  iSeven = loadImage("assets/7.png");
  iEight = loadImage("assets/8.png");
  iNine = loadImage("assets/9.png");
  iRedPipe = loadImage("assets/pipe-red.png");
  iGreenPipe = loadImage("assets/pipe-green.resized.png");
  iBase = loadImage("assets/base.resized.png");
  iBgDay = loadImage("assets/background-day.png");
  iBgNight = loadImage("assets/background-night.png");
  iGameOver = loadImage("assets/gameover.png");
  iYellowBird1 = loadImage("assets/yellowbird-downflap.png");
  iYellowBird2 = loadImage("assets/yellowbird-midflap.png");
  iYellowBird3 = loadImage("assets/yellowbird-upflap.png");
  iBlueBird1 = loadImage("assets/bluebird-downflap.png");
  iBlueBird2 = loadImage("assets/bluebird-midflap.png");
  iBlueBird3 = loadImage("assets/bluebird-upflap.png");
  iRedBird1 = loadImage("assets/redbird-downflap.png");
  iRedBird2 = loadImage("assets/redbird-midflap.png");
  iRedBird3 = loadImage("assets/redbird-upflap.png");
  iGreenPipe1 = loadImage("assets/pipe-green1.resized.png");
  iMessage = loadImage("assets/message.png");

  for (var i=0; i < numOfBirds; i++) {
    birds[i].image = iRedBird1;
  }
  player.image = iYellowBird1;
}

function initPipes() {
  var min = 100;
  var max = 500;
  farthestX = 600;
  for (var i=0; i < numOfPipes * 2; i += 2) {
    var random =Math.floor(Math.random() * (+max - +min)) + +min;
    pipes[i] = farthestX;
    pipes[i + 1] = random;
    farthestX += pipeSpaceX;
  }

  nextPipeY = pipes[1] + pipeSpaceY;
}

function addPipe() {
  var min = 100;
  var max = 500;
  var random =Math.floor(Math.random() * (+max - +min)) + +min;
  farthestX = 600;
  pipes.push(farthestX + pipeSpaceX);
  pipes.push(random);
  nextPipeY = pipes[1] + pipeSpaceY;
}

function drawScore() {
  var numOfDigits = score.toString().length;
  var leftX = 310 - (Math.floor(numOfDigits / 2) * 30);
  var num = score.toString();

  for (var i=0; i < num.length; i++) {
    switch(num.charAt(i)) {
      case "1":
        ctx.drawImage(iOne, leftX + (i * 30), 50, 24, 36);
        break;
      case "2":
        ctx.drawImage(iTwo, leftX + (i * 30), 50, 24, 36);
        break;
      case "3":
        ctx.drawImage(iThree, leftX + (i * 30), 50, 24, 36);
        break;
      case "4":
        ctx.drawImage(iFour, leftX + (i * 30), 50, 24, 36);
        break;
      case "5":
        ctx.drawImage(iFive, leftX + (i * 30), 50, 24, 36);
        break;
      case "6":
        ctx.drawImage(iSix, leftX + (i * 30), 50, 24, 36);
        break;
      case "7":
        ctx.drawImage(iSeven, leftX + (i * 30), 50, 24, 36);
        break;
      case "8":
        ctx.drawImage(iEight, leftX + (i * 30), 50, 24, 36);
        break;
      case "9":
        ctx.drawImage(iNine, leftX + (i * 30), 50, 24, 36);
        break;
      case "0":
        ctx.drawImage(iZero, leftX + (i * 30), 50, 24, 36);
        break;
      default:
        break;
    }
  }
}

function checkHit() {
  var topY = player.y + 3;
  var bottomY = player.y + player.width - 3;
  var rightX = player.x + player.width - 3;
  var leftX = player.x + 3;

  for (var i=0; i < pipes.length; i += 2) {
    var pipeLeftX = pipes[i] + 2, pipeRightX = pipes[i] + pipeWidth - 2, pipeBottomY = pipes[i + 1] + 2;
    var pipeTopY = pipes[i + 1] + 2 + pipeSpaceY;

    if (rightX >= pipeLeftX && leftX <= pipeRightX) {
      if (bottomY >= pipeTopY) {
        died = true;
        break;
      }

      if (topY <= pipeBottomY) {
        died = true;
        break;
      }
    }
  }

  if (topY >= height) {
    died = true;
  }

  if (bottomY <= 0) {
    died = true;
  }

  if (died) {
    playing = false;
    if (score > highestScore) {
      highestScore = score;
    }
    score = 0;
    initPipes();
    ctx.clearRect(0, 0, width, height);
  }
}

function checkHitBirds() {
  for (var i=0; i < birds.length; i++) {
    if (birds[i].died) continue;

    var topY = birds[i].y + 3;
    var bottomY = birds[i].y + birds[i].width - 3;
    var rightX = birds[i].x + birds[i].width - 3;
    var leftX = player.x + 3;

    var pipeLeftX = pipes[0] + 2, pipeRightX = pipes[0] + pipeWidth - 2, pipeBottomY = pipes[1] + 2;
    var pipeTopY = pipes[1] + 2 + pipeSpaceY;

    if (rightX >= pipeLeftX && leftX <= pipeRightX) {
      if (bottomY >= pipeTopY) {
        birds[i].died = true;
        break;
      }

      if (topY <= pipeBottomY) {
        died = true;
        birds[i].died = true;
        break;
      }
    }

    if (birds[i].y < 0) birds[i].died = true;
    if (birds[i].y > height) birds[i].died = true;
  }

  var allDied = true;
  for (var i=0; i < birds.length; i++) {
    allDied = allDied && birds[i].died;
  }
  if (allDied) {
    pipeSpeed = 2.5;
    score = 0;
    initPipes();
    for (var i=0; i < birds.length; i++) {
      var randY = Math.floor(Math.random() * 500) + 100;
      birds[i].x = 20;
      birds[i].y = randY;
      birds[i].died = false;
    }
    evolve(); // Uncoment this and one more line below for the evolution process
    allDied = false;
  }
}

function drawBackground() {
  if (score == 10 || score == 30 || score == 50 || score == 70 || score == 90 || score == 110 || score == 130 || score == 150) {
    drawDay = false;
  }
  if (score == 0 || score == 20 || score == 40 || score == 60 || score == 80 || score == 100 || score == 120 || score == 140 || score == 160) {
    drawDay = true;
  }

  for (var i=0; i < bgImages.length; i++) {
    if (drawDay)
      ctx.drawImage(iBgDay, bgImages[i], 0, width, height);
    else
      ctx.drawImage(iBgNight, bgImages[i], 0, width, height);
    bgImages[i] -= pipeSpeed / 2;
    if (bgImages[i] < 0 - width) {
      bgImages[i] += 2 * width;
    }
  }

  drawPipes();

  for (var i=0; i < baseImages.length; i += 1) {
    ctx.drawImage(iBase, baseImages[i], height - 60, width, 150);
    baseImages[i] -= pipeSpeed;
    if (baseImages[i] < 0 - width) {
      baseImages[i] += 2 * width;
    }
  }
}

function drawDeadPlayer() {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(player.x, player.y, player.width, player.width);
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.width);
}

function drawPipes() {
  ctx.fillStyle = "#00FF00";
  for (var i=0; i < pipes.length; i += 2) {
    ctx.drawImage(iGreenPipe1, pipes[i], pipes[i + 1] - pipeHeight, pipeWidth, pipeHeight);
    ctx.drawImage(iGreenPipe, pipes[i], pipes[i + 1] + pipeSpaceY, pipeWidth, pipeHeight);
  }

  if (pipes[0] + pipeWidth <= 0) {
    pipes.shift();
    pipes.shift();
    addPipe();
    score += 1;
  }
}

function drawGeneticPlayers() {
  for (var i=0; i < birds.length; i++) {
    ctx.drawImage(birds[i].image, birds[i].x, birds[i].y, birds[i].width, birds[i].width);
  }
}

function randomizeBirds() {
  for (let i=0; i < birds.length; i++) {
    let nn = new NeuralNetwork(4, numOfHiddenLayers, 1);
    birds[i].neuralNetwork = nn;
  }
}

function doIJump(bird, dx, dy, dy2) {
  var a0 = dx, a1 = dy, a2 = dy2, a3 = bird.velocity / maxVelocity;
  let res = bird.neuralNetwork.feedforward([a0, a1, a2, a3]);
  return res.data[0][0];
}

function evolve() {
  var bestDistance = -1;
  var bird = -1;
  generation += 1;
  for (var i=0; i < birds.length; i++) {
    if (birds[i].distanceTraveled > bestDistance) {
      bestDistance = birds[i].distanceTraveled;
      bird = i;
    }
    birds[i].image = iRedBird1;
    birds[i].distanceTraveled = 0;
  }
  birds[bird].image = iBlueBird1;

  if (bestDistance > bestOverallDistance) {
    bestOverallDistance = bestDistance;
    optimalBird = birds[bird].neuralNetwork.copy();
  }

  var maxInc = 0.1;
  var maxInc2 = 0.001;
  var strongOne = birds[bird];

  for (var i=0; i < birds.length; i++) {
    if (bird == i) {
      continue;
    } else if (generation < 3 && i < 3) {
      birds[i].neuralNetwork = new NeuralNetwork(4, numOfHiddenLayers, 1);
      birds[i].image = iYellowBird1;
      continue;
    } else if (i > 3 && i < 6 || generation > 3 && i < 20) {
      birds[i].image = iBlueBird1;
      birds[i].neuralNetwork = optimalBird.copy();
      birds[i].neuralNetwork.mutate(.001);
      continue;
    }
    birds[i].image = iRedBird1;
    birds[i].neuralNetwork = NeuralNetwork.makeBaby(optimalBird, strongOne.neuralNetwork);
    birds[i].neuralNetwork.mutate(maxInc);
  }
}

function checkForBirdsToJump() {
  for (var i=0; i < birds.length; i++) {
    if (birds[i].died) continue;

    birds[i].distanceTraveled++;
    var dy = (nextPipeY - (birds[i].y + birds[i].width)) / 600;
    var dy2 = (nextPipeY - (birds[i].y + birds[i].width) - pipeSpaceY) / 600;
    var dx = (pipes[0] - (birds[i].x + birds[i].width)) / 600;
    var p = doIJump(birds[i], dx, dy, dy2);

    if (p >= 0.5) {
      birds[i].jump = true;
    }

    ctx.beginPath();
    if (i == 0) ctx.strokeStyle = "yellow";
    else if (i == 1) ctx.strokeStyle = "red";
    else ctx.strokeStyle = "blue";
    if ( i == 0 ) ctx.fillStyle = "yellow";
    else if (i == 2) ctx.fillStyle = "red";
    else ctx.fillStyle = "blue";
    ctx.strokeWidth = 5;
    var x = 20;
    if (i == 1) x = 30;
    else if (i == 2) x = 40;

    ctx.moveTo(x, birds[i].y + birds[i].width);
    ctx.lineTo(x, nextPipeY);
    ctx.stroke();

    ctx.moveTo(x, birds[i].y + 50);
    ctx.lineTo(pipes[0], birds[i].y + 50);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#96D6FF";
  ctx.fillStyle = "#96D6FF";
  ctx.fillRect(0, 0, width, height);

  drawBackground();
  //checkHit(); // REGULAR GAME CODE
  //if (!died) drawPlayer(); // REGULAR GAME CODE
  //else drawDeadPlayer(); // REGULAR GAME CODE
  checkHitBirds(); // GENETIC CODE
  checkForBirdsToJump(); // GENETIC CODE
  drawGeneticPlayers(); // GENETIC CODE
  drawScore();
}

function drawMenu() {
  ctx.drawImage(iMessage, 100, 100, width - 200, height - 300);
  ctx.fillStyle = "#FFF";
  ctx.font = "30px Arial";
  ctx.fillText("High Score: " + highestScore, 200, 650);
}

function update() {
  if (!playing) {
    drawBackground();
    drawMenu();
    window.requestAnimationFrame(update);
    died = false;
    pipeSpeed = 2.5, pipeAcceleration = 0.001
    player.y = 400;
    player.x = 20;
  } else {
    /*
    // REGULAR GAME CODE
    player.y += player.velocity;
    player.velocity += player.acceleration;

    if (player.velocity >= maxVelocity) player.velocity = maxVelocity;
    if (player.velocity <= minVelocity) player.velocity = minVelocity;
    if (player.acceleration < 0) player.acceleration = acceleration;

    if (!died) {
      if (doJump) {
        player.acceleration = jumpForce;
        doJump = false;
      }
    }*/



      // GENETIC ALGORITHM CODE
      for (var i=0; i < birds.length; i++) {
        birds[i].y += birds[i].velocity;
        birds[i].velocity += birds[i].acceleration;

        if (birds[i].velocity >= maxVelocity) birds[i].velocity = maxVelocity;
        if (birds[i].velocity <= minVelocity) birds[i].velocity = minVelocity;
        if (birds[i].acceleration < 0) birds[i].acceleration = acceleration;

        if (!birds[i].died) {
          if (birds[i].jump) {
            birds[i].acceleration = jumpForce;
            birds[i].jump = false;
          }
        }
      }

        for (var i=0; i < pipes.length; i += 2) {
          pipes[i] -= pipeSpeed;
        }
        pipeSpeed += pipeAcceleration;

        if (pipeSpeed >= 3.0) {
          pipeSpeed = 3.0;
        }

      draw();
      window.requestAnimationFrame(update);
    }
}

function playJumpAnimation() {
  if (animFrame == 0) {
    player.image = iYellowBird2;
  } else if (animFrame == 1) {
    player.image = iYellowBird3;
  } else if (animFrame == 2) {
    player.image = iYellowBird1;
  } else {
    animFrame = 0;
    return;
  }

  animFrame++;
  setTimeout(playJumpAnimation, 70);
}

document.onkeypress = function(e) {
  e = e || window.event;
  if (e.keyCode == 32) {
    if (!playing) playing = true;
    if (!doingFlap) setTimeout(playJumpAnimation, 70);
    doJump = true;
    //update();
  }
}

function init() {
  randomizeBirds(); // FOR NEURAL NETWORK // Uncomment this line too
  loadAssets();
  initPipes();
  update();
}

init();
