let coverImg; // Cover page background image
let instructImg; // Instruction background image
let dog;
let dogImg, chickenImg, vegetableImg, candyImg, bgImg, winBgImg, loseBgImg;
let items = [];
let score = 0;
let wrongCatch = 0;
let gameState = 'cover'; // Start with the cover page
let bgMusic; // Background music
let musicStarted = false; // Track if music has started

function preload() {
  coverImg = loadImage('FC.png');// Frpnt Cover
  bgImg = loadImage('Kitchen.png');// Kitchen Background
  dogImg = loadImage('Doggy.png');
  chickenImg = loadImage('Chicken.png');// Good Item
  vegetableImg = loadImage('Veg.png');// Bad Item
  candyImg = loadImage('Choc.png');// Bad Item
  winBgImg = loadImage('Winner.png');// Winning Page
  loseBgImg = loadImage('Lost.png');// Losing Page
  instructImg = loadImage('Instruct.png');// Instructions
  bgMusic = loadSound('Music.mp3'); // Background music
}

function setup() {
  createCanvas(700, 700);
  dog = {
    x: width / 2,
    y: height - 150,
    width: 150,
    height: 150
  };
  
  spawnItem(); // Initialize the first item
}

// Start playing background music after user interaction
function mousePressed() {
  if (!musicStarted) {
    bgMusic.loop();
    musicStarted = true; // Set flag to true so it doesn’t restart
  }
}

function draw() {
  if (gameState === 'cover') {
    displayCover();
  } else if (gameState === 'instructions') {
    displayInstructions();
  } else if (gameState === 'playing') {
    background(bgImg);
    displayDog();
    displayItems();
    moveItems();
    checkCatch();
    displayScore();

    if (score >= 3) {
      gameState = 'win';
    } else if (wrongCatch >= 3) {
      gameState = 'lose';
    }
  } else if (gameState === 'win') {
    displayWin();
  } else if (gameState === 'lose') {
    displayLose();
  }
}

// Additional functions remain the same

function displayCover() {
  background(coverImg); // Front Cover Page
}

function displayInstructions() {
  background(instructImg); // Instruction Page
}

function displayDog() {
  push();
  translate(dog.x + dog.width / 2, dog.y + dog.height / 2);
  image(dogImg, -dog.width / 2, -dog.height / 2, dog.width, dog.height);
  pop();
}

function keyPressed() {
  if (gameState === 'cover' && keyCode === ENTER) {
    gameState = 'instructions'; // Move to instructions page
  } else if (gameState === 'instructions' && keyCode === ENTER) {
    gameState = 'playing'; // Move to the main game
  } else if (gameState === 'playing') {
    if (keyCode === LEFT_ARROW) {
      dog.x -= 20;
    } else if (keyCode === RIGHT_ARROW) {
      dog.x += 20;
    }
    dog.x = constrain(dog.x, 0, width - dog.width);
  } else if ((gameState === 'win' || gameState === 'lose') && keyCode === ENTER) {
    // Reload the page to restart the game
    window.location.reload();
  }
}

function spawnItem() {
  let itemType = random(['chicken', 'vegetable', 'candy']);
  let img = itemType === 'chicken' ? chickenImg : itemType === 'vegetable' ? vegetableImg : candyImg;
  items.push({
    x: random(width),
    y: -50,
    img: img,
    type: itemType,
    size: 100,
    speed: random(3, 5)
  });
}

function moveItems() {
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    item.y += item.speed; // Move item down by its speed

    // Remove item if it goes off the screen bottom
    if (item.y > height + item.size) {
      items.splice(i, 1); // Remove item directly from array
    }
  }

  // Spawn a new item every 60 frames
  if (frameCount % 60 === 0) {
    spawnItem();
  }
}

function displayItems() {
  for (let item of items) {
    image(item.img, item.x, item.y, item.size, item.size);
  }
}

function checkCatch() {
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    let isTouchingDog =
      item.y + item.size >= dog.y && 
      item.y <= dog.y + dog.height && 
      item.x + item.size > dog.x && 
      item.x < dog.x + dog.width;

    if (isTouchingDog) {
      if (item.type === 'chicken') {
        score++;
      } else {
        wrongCatch++;
      }
      items.splice(i, 1); // Remove item after it touches the dog
    }
  }
}

function displayScore() {
  textSize(17);
  fill(0);
  text(`Chicken Score: ${score}`, 60, 30);
  text(`Veggies \nand Chocolate Bars: ${wrongCatch}`, 505, 30);
}

function displayWin() {
  background(winBgImg); // Display win background image
}

function displayLose() {
  background(loseBgImg); // Display losing background image
}
