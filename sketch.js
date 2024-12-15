let serial;
let connectButton;
let isConnected = false;

let acceleration = { x: 0, y: 0, z: 0 };
let gyro = { x: 0, y: 0, z: 0 };

let mSerial;

let stitchCount = 0; // Stitch counter
let previousRotation = 0; // Tracks previous rotation for stitch calculation
let rotationDelta = 0; // Tracks cumulative rotation

let spiralGroups = []; // Persistent spirals on canvas
let yarnTrail = []; // Unraveling yarn trail
let floatingParticles = []; // Floating particles
let maxParticles = 100; // Max number of particles

let stitchSound; // Sound for stitch increment

function preload() {
  // Load the sound file
  stitchSound = loadSound('stitchSound.mp3');
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    connectButton.hide();
    isConnected = true;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2 - 50, height / 2);
  connectButton.mousePressed(connectToSerial);

  colorMode(HSB, 255);
  noStroke();

  // Initialize floating particles
  for (let i = 0; i < maxParticles; i++) {
    floatingParticles.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      hue: random(50, 255),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
    });
  }
}

function addSpiralGroup(baseX, baseY, motionFactor) {
  let spirals = [];
  for (let i = 0; i < 5; i++) {
    let angle = frameCount * 0.02 + i * TWO_PI / 5;
    let radius = 100 + motionFactor * 20; // Spread out more across the canvas
    let x = baseX + cos(angle) * radius;
    let y = baseY + sin(angle) * radius;
    let outerHue = random(50, 255); // Vibrant color palette for spirals
    let innerHue = random(50, 255); // Different hue for the inner circle
    let colorSaturation = random(150, 255);
    let opacity = random(150, 255); // Randomized opacity for spirals

    spirals.push({
      x: x,
      y: y,
      baseX: baseX,
      baseY: baseY,
      angleOffset: random(TWO_PI),
      outerHue: outerHue,
      innerHue: innerHue,
      saturation: colorSaturation,
      opacity: opacity,
      size: 5 + motionFactor,
      holeSize: random(2, 4), // Add hole size for donut effect
      strokeHue: random(0, 255), // Randomized stroke color for each spiral
    });
  }
  spiralGroups.push(spirals);
}

function drawSpirals() {
  for (let group of spiralGroups) {
    for (let spiral of group) {
      let spinAngle = frameCount * 0.01 + spiral.angleOffset; // Add spinning effect
      let x = spiral.baseX + cos(spinAngle) * 20;
      let y = spiral.baseY + sin(spinAngle) * 20;

      stroke(spiral.strokeHue, 200, 255, spiral.opacity); // Unique stroke color for each spiral
      strokeWeight(2);
      fill(spiral.outerHue, spiral.saturation, 255, spiral.opacity);
      ellipse(x, y, spiral.size);
      fill(spiral.innerHue, spiral.saturation, 200, spiral.opacity); // Inner vibrant circle
      ellipse(x, y, spiral.size - spiral.holeSize * spiral.size);
      // Fade spirals into the background over time
      spiral.opacity = max(0, spiral.opacity - 0.2);
    }
  }
}

function drawYarnTrail() {
  beginShape();
  noFill();
  strokeWeight(3);

  for (let i = 0; i < yarnTrail.length; i++) {
    let point = yarnTrail[i];

    // Introduce variation in motion for different segments
    let variation = i % 3; // Create variations every 3 segments
    let offsetX, offsetY;

    if (variation === 0) {
      // Smooth looping motion
      offsetX = sin(frameCount * 0.01 + i * 0.2) * 15;
      offsetY = cos(frameCount * 0.01 + i * 0.2) * 10;
    } else if (variation === 1) {
      // Curvy, wavy motion
      offsetX = cos(frameCount * 0.02 + i * 0.1) * 20;
      offsetY = sin(frameCount * 0.02 + i * 0.1) * 20;
    } else {
      // More horizontal, subtle curves
      offsetX = sin(frameCount * 0.015 + i * 0.05) * 25;
      offsetY = sin(frameCount * 0.01) * 5;
    }

    let hue = map(i, 0, yarnTrail.length, 0, 255); // Smooth color gradient for the trail
    stroke(hue, 200, 255, 150); // Smooth yarn color with consistent opacity

    // Apply smooth curve vertex positions with varied motion
    curveVertex(point.x + offsetX, point.y + offsetY);
  }
  endShape();
}

function drawParticles() {
  for (let particle of floatingParticles) {
    fill(particle.hue, 200, 255, 200);
    noStroke();
    ellipse(particle.x, particle.y, particle.size);

    // Update particle position
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Wrap particles around the canvas
    if (particle.x > width) particle.x = 0;
    if (particle.x < 0) particle.x = width;
    if (particle.y > height) particle.y = 0;
    if (particle.y < 0) particle.y = height;
  }
}

function draw() {
  let bgHue = map(sin(frameCount * 0.01), -1, 1, 0, 255); // Dynamic smooth color changing background
  background(bgHue, 50, 200, 150);

  if (!isConnected) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Waiting for connection...", width / 2, height / 2);
    return;
  }

  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    let mLine = mSerial.readUntil("\n");
    let mNumbers = mLine.trim().split(".");

    if (mNumbers.length >= 6) {
      acceleration.x = float(mNumbers[0]);
      acceleration.y = float(mNumbers[1]);
      acceleration.z = float(mNumbers[2]);
      gyro.x = float(mNumbers[3]);
      gyro.y = float(mNumbers[4]);
      gyro.z = float(mNumbers[5]);
    }
  }

  // Increment stitch counter based on rotation, slower rate
  let currentRotation = gyro.z;
  rotationDelta += abs(currentRotation - previousRotation) * 0.5;
  if (rotationDelta >= 320) {
    stitchCount++;
    rotationDelta = 0;

    // Play the stitch sound effect
    stitchSound.play();
  }
  previousRotation = currentRotation;

  // Add new spiral group based on motion data
  let motionFactor = abs(acceleration.x) + abs(acceleration.y) + abs(acceleration.z);
  addSpiralGroup(width / 2 + acceleration.x * 200, height / 2 + acceleration.y * 200, motionFactor); // Spread out more

  // Update yarn trail based on motion
  yarnTrail.push({
    x: width / 2 + acceleration.x * 200,
    y: height / 2 + acceleration.y * 200,
  });

  // Draw yarn trail
  drawYarnTrail();

  // Draw all spirals
  drawSpirals();

  // Draw floating particles
  drawParticles();

  function addSpiralGroup(baseX, baseY, motionFactor) {
    let spirals = [];
    let shapes = ["circle", "rectangle", "triangle", "star"];
    
    for (let i = 0; i < 5; i++) {
      let angle = random(TWO_PI); // Randomize placement around the base
      let radius = 200 + motionFactor * random(30, 50); // Spread out with motion
      let x = baseX + cos(angle) * radius + random(-50, 50); // Add random offsets
      let y = baseY + sin(angle) * radius + random(-50, 50); // Add random offsets
      let outerHue = random(50, 255); // Vibrant color palette for spirals
      let innerHue = random(50, 255); // Different hue for the inner circle
      let shapeType = random(shapes); // Pick a random shape
  
      spirals.push({
        x: x,
        y: y,
        baseX: baseX,
        baseY: baseY,
        angleOffset: random(TWO_PI),
        outerHue: outerHue,
        innerHue: innerHue,
        shapeType: shapeType,
        size: 5 + motionFactor * random(2, 8), // **Reduced size scaling**
        holeSize: random(0.2, 0.4), // Smaller hole size for donut effect
        opacity: random(150, 255), // Opacity
      });
    }
    spiralGroups.push(spirals);
  }
  
  
  function drawSpirals() {
    for (let group of spiralGroups) {
      for (let spiral of group) {
        let spinAngle = frameCount * 0.01 + spiral.angleOffset; // Add spinning effect
        let x = spiral.baseX + cos(spinAngle) * 20;
        let y = spiral.baseY + sin(spinAngle) * 20;
  
        push();
        translate(x, y);
        rotate(spinAngle);
        stroke(spiral.outerHue, 200, 255, spiral.opacity);
        fill(spiral.innerHue, 200, 255, spiral.opacity);
  
        switch (spiral.shapeType) {
          case "circle":
            ellipse(0, 0, spiral.size, spiral.size);
            break;
          case "rectangle":
            rectMode(CENTER);
            rect(0, 0, spiral.size, spiral.size * spiral.holeSize);
            break;
          case "triangle":
            triangle(
              0, -spiral.size / 2,
              -spiral.size / 2, spiral.size / 2,
              spiral.size / 2, spiral.size / 2
            );
            break;
          case "star":
            drawStar(0, 0, spiral.size / 2, spiral.size, 5);
            break;
        }
        pop();
  
        // Fade out spirals over time
        spiral.opacity = max(0, spiral.opacity - 0.5);
      }
    }
  }
  
  
  // Function to draw a star
  function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
  
  // Display stitch counter
  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text(`Stitches: ${stitchCount}`, 20, 20);
}
