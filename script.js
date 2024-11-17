window.addEventListener("load", start);

let player = {
  x: 100,
  y: 100,
  speed: 70, // px/s
  width: 30,
  height: 40,
};

let enemy = {
  x: 185,
  y: 180,
  speed: 200, // px/s
  width: 30,
  height: 40,
};

const gameField = {
  width: 400,
  height: 400,
};

let controls = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function start() {
  console.log("start.. ");

  requestAnimationFrame(tick);

  document.addEventListener("keydown", (event) => {
    updateKeyState(event.key, true);
  });

  document.addEventListener("keyup", (event) => {
    updateKeyState(event.key, false);
  });
}

// *************** controls *******************

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

// ************* view **********************

function displayPlayer() {
  const visualPlayer = document.querySelector("#player");

  visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function displayEnemy() {
  const visualEnemy = document.querySelector("#enemy");
  visualEnemy.style.translate = `${enemy.x}px ${enemy.y}px`;
}

// ******** tick / view *********

let lastTime = 0;
function tick(time) {
  requestAnimationFrame(tick);

  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  movePlayer(deltaTime);
  moveEnemy(deltaTime);

  // check collisions
  if (isColliding(player, enemy)) {
    player.collision = true;
    enemy.collision = true;
    console.log("true");
  } else {
    player.collision = false;
    enemy.collision = false;
  }

  // update display
  displayPlayer();
  displayEnemy();
  displayCollisionInfo();
}

/*
Note fra petl:
fordi du har samme hastighed i begge retninger (som man normalt har), 
så kan du i din if-sætning der tjekker om den skal bevæge sig diagonalt, 
bare gange begge delta (deltaX og deltaY) med 0.707, altså kvadratroden af 0.5 
*/
// lav check om midlertidig position er lovlig
let playerDirection = { x: 0, y: 0 };
function movePlayer(deltaTime) {

  if (controls.up) {
    playerDirection.y = -1;
  } else if (controls.down) {
    playerDirection.y = +1;
  }
  if (controls.left) {
    playerDirection.x = -1;
  } else if (controls.right) {
    playerDirection.x = +1;
  }

  if (playerDirection.x == 0 && playerDirection.y == 0) return;

  // calculate distance to make sure player doesn't move faster diagonally
  const dist = Math.hypot(playerDirection.x, playerDirection.y);
  playerDirection.x /= dist;
  playerDirection.y /= dist;

  const movement = {
    x: playerDirection.x * player.speed * deltaTime,
    y: playerDirection.y * player.speed * deltaTime,
  };

  const position = { x: player.x, y: player.y };
  position.x += movement.x;
  position.y += movement.y;

  if (canMove(player, position)) {
    player.x = position.x;
    player.y = position.y;
  }
}

// function movePlayer(deltaTime) {
//   const position = { x: player.x, y: player.y };
//   let deltaY = 0;
//   let deltaX = 0;

//   if (controls.up) {
//     deltaY -= player.speed * deltaTime;
//   } else if (controls.down) {
//     deltaY += player.speed * deltaTime;
//   }
//   if (controls.left) {
//     deltaX -= player.speed * deltaTime;
//   } else if (controls.right) {
//     deltaX += player.speed * deltaTime;
//   }

//   if (deltaX != 0 && deltaY != 0) {
//     // console.log("player bevæger sig diagonalt");

//     const dist = Math.hypot(deltaX, deltaY);
//     // const dist = 1.4142;

//     // console.log("dist hpot: ", dist);

//     deltaX = deltaX / dist;
//     deltaY = deltaY / dist;
//   }

//   position.x += deltaX;
//   position.y += deltaY;

//   if (canMove(player, position)) {
//     player.x = position.x;
//     player.y = position.y;
//   }
// }

let enemyDirection = -1; // -1 for left, 1 for right
function moveEnemy(deltaTime) {
  const position = { x: enemy.x, y: enemy.y };
  let deltaX = enemy.speed * deltaTime * enemyDirection;

  // Update position
  position.x += deltaX;

  // Change direction if the enemy reaches the edges of the game field
  if (position.x <= 0) {
    enemyDirection = 1; // Move right
  } else if (position.x >= gameField.width - enemy.width) {
    enemyDirection = -1; // Move left
  }

  enemy.x = position.x;
}

function canMove(player, position) {
  if (position.x < -2 || position.y < -2 || position.x > gameField.width - player.width || position.y > gameField.height - player.height) return false;

  return true;
}

function isColliding(player, enemy) {
  // check if bottom of player hits top of enemy
  const belowTop = player.y + player.height >= enemy.y;

  // check if top of player hits bottom of enemy
  const aboveBottom = player.y <= enemy.y + enemy.height;

  // check if player's right side hits enemy's left side |P|-->|E|
  const afterLeft = player.x + player.width >= enemy.x;

  // check if player's left side hits enemy's right side |E|-->|P|
  const beforeRight = player.x <= enemy.x + enemy.width;

  // Only if all four conditions are met, are the player and enemy colliding
  return belowTop && aboveBottom && afterLeft && beforeRight;
}

function displayCollisionInfo() {
  const collisionInfo = document.querySelector("#collision-status");
  if (player.collision) {
    collisionInfo.textContent = "You're DEAD!!";
    collisionInfo.classList.add("collision");
  } else {
    collisionInfo.textContent = "Game on! ...";
    collisionInfo.classList.remove("collision");
  }
}
