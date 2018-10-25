// Array to store raindrop objects
var dropArr = [];

// Canvas and drawing context
var canvas, context;

// Unsimulated time
var delta = 0;

/* Previous timestamp; the difference between the current and previous
timestamps gives the time between successive calls to main */
var prevTime = 0;

// The timestep in ms for running at 60FPS
var timeStep = 1000/60;

// Raindrop acceleration (px/ms^2)
var accel = 0.002;

// Number of raindrops
var numDrops = 75;

// Raindrop class
class raindrop {
  /* Initializes a random position at the top of the screen,
  and a random hue of blue */
  constructor() {
    this.init = false;
    if(Math.floor(Math.random()*300) == 0) {
      this.init = true;
    }

    this.y = -20;
    this.x = Math.floor(Math.random()*canvas.width);

    this.dropSpeed = 0.0015 + Math.random()/128;

    var shade = Math.floor(Math.random()*90)+10;
    this.color = "#" + String(shade) + String(shade) + "FF";
  }

  updateDrop(delta) {
    if(this.init) {
      this.y += this.dropSpeed*delta;
      this.dropSpeed += accel;

      if(this.y > canvas.height) {
        this.init = false;
        this.x = Math.floor(Math.random()*canvas.width);
        this.y = -20;
        this.dropSpeed = 0.0015 + Math.random()/128;
      }
    }
    else {
      if(Math.floor(Math.random()*300) == 0) {
        this.init = true;
      }
    }
  }

  drawDrop() {
    if(this.init) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, 2, 10);
    }
  }
}

// Function called after the page loads
function init() {
  canvas = document.getElementById("banner");
  resize();

  context = canvas.getContext("2d");

  for(var i = 0; i < numDrops; i++) {
    dropArr.push(new raindrop());
  }

  requestAnimationFrame(main);
}

function update(delta) {
  for(var i = 0; i < numDrops; i++) {
    dropArr[i].updateDrop(delta);
  }
}

// Drawing function
function draw() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each drop
  for(var i = 0; i < numDrops; i++) {
    dropArr[i].drawDrop();
  }
}

// "Game loop"
function main(time) {
  // Add to the unsimulated time
  delta += time - prevTime;

  if(delta < timeStep) {
    requestAnimationFrame(main);
    return;
  }

  prevTime = time;

  // The number of steps simulated in this frame
  var numSteps = delta/timeStep;
  for(var i = 0; i < numSteps; i++) {
    // Simulate a single timestep
    update(timeStep);

    // If too many timesteps need to be simulated, break
    if(i > 200) {
      delta = 0;
      break;
    }

    // Subtract a timestep from the time needed to be simulated
    delta -= timeStep;
  }

  draw();
  requestAnimationFrame(main);
}

function resize() {
  canvas.width = window.innerWidth;
}
