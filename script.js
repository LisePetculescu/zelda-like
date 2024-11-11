window.addEventListener("load", start);

let playerPosition = {
  x: 100,
  y: 100,
  speed: 50 // px/s
};
const gameField = {
  width: 400,
  height: 400
};
const playerSize = {
  width: 60, // Set the width of the player
  height: 80 // Set the height of the player
};
let controls = {
  up: false,
  down: false,
  left: false,
  right: false
};

let lastTime = 0;
// let direction = 0;
let direction = { x: 0, y: 0 };

function start() {
  console.log("start.. ");

  displayPlayer();
  requestAnimationFrame(tick);

  document.addEventListener("keydown", (event) => {
    updateKeyState(event.key, true);
    // updateDirection();
  });

  document.addEventListener("keyup", (event) => {
    updateKeyState(event.key, false);
    // updateDirection();
  });
}

function displayPlayer() {
  const visualPlayer = document.querySelector("#player");

  //  look Left
  // visualPlayer.style.backgroundPosition = "200% 200%"
  // walk left
  // visualPlayer.style.backgroundPosition = "300% 200%"

  // look right
  //    visualPlayer.style.backgroundPosition = "200% 100%";
  // walk right
  //    visualPlayer.style.backgroundPosition = "300% 100%";

  // look down
  // visualPlayer.style.backgroundPosition = "400% 400%";

  // walk down
  // visualPlayer.style.backgroundPosition = "300% 400%";

  // look up
  // visualPlayer.style.backgroundPosition = "400% 300%";
  // walk up
  // visualPlayer.style.backgroundPosition = "300% 300%";

  visualPlayer.style.translate = `${playerPosition.x}px ${playerPosition.y}px`;

  console.log("player coordinates: ", playerPosition);
}

function tick(time) {
  requestAnimationFrame(tick);

  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  updateDirection(deltaTime);

  // Check for collision with game field boundaries using the size of the player
  if (playerPosition.x < -2) {
    playerPosition.x = 0;
  }
  if (playerPosition.x + playerSize.width / 2 > gameField.width + 2) {
    playerPosition.x = gameField.width - playerSize.width / 2;
  }
  if (playerPosition.y < -2) {
    playerPosition.y = 0;
  }
  if (playerPosition.y + playerSize.height / 2 > gameField.height + 2) {
    playerPosition.y = gameField.height - playerSize.height / 2;
  }

  displayPlayer();
}

function movingDirection(event) {
  switch (event.key) {
    case "w":
    case "ArrowUp":
      direction.y = -1;
      break;
    case "s":
    case "ArrowDown":
      direction.y = 1;
      break;
    case "a":
    case "ArrowLeft":
      direction.x = -1;
      break;
    case "d":
    case "ArrowRight":
      direction.x = 1;
      break;
  }
}

function movePlayer(deltaTime) {
  const movement = deltaTime / playerPosition.speed;

  switch (direction) {
    case 0:
      playerPosition.y = playerPosition.y - movement;
      break;
    case 1:
      playerPosition.y = playerPosition.y + movement;
      break;
    case 2:
      playerPosition.x = playerPosition.x - movement;
      break;
    case 3:
      playerPosition.x = playerPosition.x + movement;
      break;
  }

  //   playerPosition.x = playerPosition.x + 10;

  displayPlayer();
  //   playerPosition.speed = playerPosition.speed + 10;
}

function canMove(player, position) {
  if (playerPosition.x > 0 && playerPosition.x < gameField.width && playerPosition.y > 0 && playerPosition.y < gameField.height) return true;
  else return false;
}

function updateKeyState(key, isPressed) {
  switch (key) {
    case "w":
    case "ArrowUp":
      controls.up = isPressed;
      break;
    case "s":
    case "ArrowDown":
      controls.down = isPressed;
      break;
    case "a":
    case "ArrowLeft":
      controls.left = isPressed;
      break;
    case "d":
    case "ArrowRight":
      controls.right = isPressed;
      break;
  }
}

function updateDirection(deltaTime) {
  if (canMove) {
    console.log("true");
    if (controls.up) {
      playerPosition.y -= playerPosition.speed * deltaTime;
    }
    if (controls.down) {
      playerPosition.y += playerPosition.speed * deltaTime;
    }
    if (controls.left) {
      playerPosition.x -= playerPosition.speed * deltaTime;
    }
    if (controls.right) {
      playerPosition.x += playerPosition.speed * deltaTime;
    }
  }
}
