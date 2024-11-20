let gameState = "center";  // Tracks the current state of the game (center, left, or right)
let message = "You are in a room with two paths. Go Left (L) or Right (R).";
let gameEnded = false;     // Tracks if the game has ended (win or lose)

let stars = [];  // Array to hold star positions
let confetti = [];  // Array to hold confetti particles
let mermaidBg;  // Variable to hold the mermaid background image
let MermaidSound;  // Declare variable for the mermaid background sound
let Castlestart;      // Variable to hold the castle starting page background image

function preload() {
  // Load the mermaid background image
  mermaidBg = loadImage('ocean.jpg'); // ocean
   // Load the path background image
  pathBg = loadImage('path.jpg'); // path
  MermaidSound = loadSound('song.mp3'); //mermaid singing
  
}

function setup() { 
  createCanvas(700, 700);  // Set up the canvas size
  textSize(15);            // Set the text size to 15
  textStyle(BOLD);         // Make the font bold
  textAlign(CENTER, CENTER); // Center the text alignment

  // Initialize stars
  for (let i = 0; i < 100; i++) {  // Adjust the number of stars as needed
    stars.push({ x: random(width), y: random(height) });
  }

  // Initialize confetti
  for (let i = 0; i < 100; i++) { // Adjust the number of confetti particles as needed
    confetti.push(createConfetti());
  }
}

function draw() {
    if (gameState === "start") {
    background(100, 150, 200);  // Choose a background color for the start page
    fill(255);  // Set text color to white
    textSize(30);  // Larger text for the title
    text("Welcome to the Adventure!", width / 2, height / 2 - 50);
    textSize(20);  // Smaller text for the instructions
    text("Press ENTER to begin", width / 2, height / 2);
    }
  if (gameState === "center") {
    background(230, 190, 255);  // Light purple background for the center room
  } else if (gameState === "party") {
    background(0);  // Black background for the party
    drawStars();    // Draw stars on the party page
    drawMoon();     // Draw the moon on the party page
    drawConfetti();  // Draw confetti particles
  } else if (gameState === "mermaid") {
    // Display the mermaid background image
    image(mermaidBg, 0, 0, width, height); // Draw the background image for the mermaid page
     // Play the mermaid sound when on the mermaid page
    if (!MermaidSound.isPlaying()) {
      MermaidSound.play();
    }
  } else {
    background(173, 216, 230);  // Light blue background for other rooms
    // Display the message to the player
  if (gameState !== "start") {
    fill(255);  // Set text color to white
    text(message, width / 2, height / 2);
    updateMessage()}
  }

  // Display the message to the player
  fill(255);  // Set text color to white
  text(message, width / 2, height / 2);

  // Update message based on gameState
  updateMessage();
}

function drawStars() {
  noStroke();
  fill(255); // White color for stars
  for (let star of stars) {
    ellipse(star.x, star.y, 2, 2);  // Draw stars at stored positions
  }
}

function drawMoon() {
  noStroke();
  fill(240, 240, 255);  // Light color for the moon
  let moonSize = 80;    // Size of the moon
  let x = width - moonSize / 2 - 20; // Position the moon in the far right corner
  let y = 100;         // Y position of the moon

  ellipse(x, y, moonSize, moonSize); // Main moon circle

  // Craters
  fill(220, 220, 245);
  ellipse(x + 20, y - 10, 20, 20);
  ellipse(x - 30, y + 10, 15, 15);
  ellipse(x - 10, y + 20, 10, 10);
}

// Create a new confetti particle with random position, velocity, and color
function createConfetti() {
  return {
    x: random(width),
    y: random(height),
    vx: random(-2, 2), // Horizontal velocity
    vy: random(2, 5), // Vertical velocity
    color: color(random(255), random(255), random(255)) // Random color
  };
}

// Draw and update confetti particles
function drawConfetti() {
  for (let particle of confetti) {
    noStroke();
    fill(particle.color); // Set color for the particle
    ellipse(particle.x, particle.y, 5, 5); // Draw confetti particle

    // Update particle position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Reset the particle when it goes off-screen
    if (particle.x < 0 || particle.x > width || particle.y > height) {
      Object.assign(particle, createConfetti());  // Reset particle with new values
    }
  }
}
 
function updateMessage() {
  if (gameState === "mermaid") {
    message = "You chose the left path. You find a mermaid! 🧜\nSinging you a song🎵\nPress Space to return to the center.";
  } else if (gameState === "dragon") {
    message = "You chose the right path. You encounter a dragon 🐲!\nThey invite you to a castle off in the distance.\nDo you want to go to the castle🏰? \nPress (L) to accept or (R) to return.";
  } else if (gameState === "center") {
    message = "You find yourself in a magical world filled with mermaids and dragons.\nWhich one would you like to visit?: \nMermaid (L) or Dragon (R)?";
  } else if (gameState === "castle") {
    message = "You are at the castle.\n🐲: Would you like to come inside?\nYes, please (L). \nNo, thank you. I have to go home (R) Return to the center.";
  } else if (gameState === "party") {
    message = "🎉 You enter the castle and are welcomed to a grand party! 🥳\nThe dragon and other magical creatures celebrate your arrival.\nPress Space to return to the center.";
  }
}

// Detect key presses for L, R, Space, and other keys
function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "center";  // Start the game when ENTER is pressed
  }
  if (gameEnded && key === ' ') {
    restartGame();  // Restart the game if it's over and the player presses Space
  } else if (!gameEnded) {
    // Move between rooms based on the current gameState
    if (gameState === "center") {
      if (key === 'L' || key === 'l') {
        gameState = "mermaid";   // Go left to meet the mermaid
      } else if (key === 'R' || key === 'r') {
        gameState = "dragon";    // Go right to meet the dragon
      }
    } else if (gameState === "mermaid" && key === ' ') {
      MermaidSound.stop();       // Stop the mermaid sound when returning to the center
      gameState = "center";      // Press Space to return to the center from the mermaid
    } else if (gameState === "dragon") {
      if (key === 'R' || key === 'r') {
        gameState = "center";    // Press R to return to the center from the dragon
      } else if (key === 'L' || key === 'l') {
        gameState = "castle";    // Press L to go to the castle with the dragon
      }
    } else if (gameState === "castle") {
      if (key === 'R' || key === 'r') {
        gameState = "center";    // Press R to return to the center from the castle
      } else if (key === 'L' || key === 'l') {
        gameState = "party";     // Press L to enter the party at the castle
      }
    } else if (gameState === "party" && key === ' ') {
      gameState = "center";      // Press Space to return to the center after the party
    }
  }
}

// Restart the game
function restartGame() {
  gameState = "center";   // Reset to the center room
  message = "You are in a room with two paths. Go Left (L) or Right (R).";
  gameEnded = false;      // Reset the game ended status

  // Reset confetti for a new game
  confetti = [];
  for (let i = 0; i < 100; i++) { // Adjust the number of confetti particles as needed
    confetti.push(createConfetti());
  }
}
