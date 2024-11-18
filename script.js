window.addEventListener("load", start);

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

// ************* MODEL **************
let player = {
  x: 100,
  y: 100,
  speed: 70, // px/s
  width: 30,
  height: 40,
  moving: false,
  animationDirection: ""
};

let enemy = {
  x: 185,
  y: 180,
  speed: 200, // px/s
  width: 30,
  height: 40,
  moving: true,
  animationDirection: ""
};

const gameField = {
  width: 400,
  height: 400
};

// *************** controls *******************

let controls = {
  up: false,
  down: false,
  left: false,
  right: false
};

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

let hitAnimationActive = false;
let lastTime = 0;
function tick(time) {
  requestAnimationFrame(tick);

  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  movePlayer(deltaTime);
  moveEnemy(deltaTime);

  // Check collisions
  if (isColliding(player, enemy)) {
    player.collision = true;
    enemy.collision = true;
    console.log("true");
  } else {
    player.collision = false;
    enemy.collision = false;
  }

  // Update display
  displayPlayer();
  displayEnemy();
  displayPlayerAnimation();
  displayEnemyAnimation();
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
  if (hitAnimationActive) return;

  // Reset player direction
  playerDirection.x = 0;
  playerDirection.y = 0;
  player.moving = false;

  if (controls.up) {
    playerDirection.y = -1;
    player.moving = true;
    player.animationDirection = "up";
  } else if (controls.down) {
    playerDirection.y = +1;
    player.moving = true;
    player.animationDirection = "down";
  }
  if (controls.left) {
    playerDirection.x = -1;
    player.moving = true;
    player.animationDirection = "left";
  } else if (controls.right) {
    playerDirection.x = +1;
    player.moving = true;
    player.animationDirection = "right";
  }

  if (playerDirection.x == 0 && playerDirection.y == 0) return;

  // calculate distance to make sure player doesn't move faster diagonally
  const dist = Math.hypot(playerDirection.x, playerDirection.y);
  playerDirection.x /= dist;
  playerDirection.y /= dist;

  const movement = {
    x: playerDirection.x * player.speed * deltaTime,
    y: playerDirection.y * player.speed * deltaTime
  };

  const position = { x: player.x, y: player.y };
  position.x += movement.x;
  position.y += movement.y;

  if (canMove(player, position)) {
    player.x = position.x;
    player.y = position.y;
  }
}


let enemyDirection = -1; // -1 for left, 1 for right
function moveEnemy(deltaTime) {
  const position = { x: enemy.x, y: enemy.y };
  let deltaX = enemy.speed * deltaTime * enemyDirection;

  // Update position
  position.x += deltaX;

  // Change direction if the enemy reaches the edges of the game field
  if (position.x <= 0) {
    enemyDirection = 1; // Move right
    // enemy.moving = true;
    enemy.animationDirection = "right";
  } else if (position.x >= gameField.width - enemy.width) {
    enemyDirection = -1; // Move left
    // enemy.moving = true;
    enemy.animationDirection = "left";
  }

  enemy.x = position.x;
}

function canMove(player, position) {
  if (position.x < -2 || position.y < -2 || position.x > gameField.width - player.width || position.y > gameField.height - player.height) return false;

  return true;
}

function displayPlayerAnimation() {
  const visualPlayer = document.querySelector("#player");

  if (!player.moving) {
    visualPlayer.classList.remove("animate");
  } else if (!visualPlayer.classList.contains("animate")) {
    visualPlayer.classList.add("animate");
  }

  if (player.animationDirection && !visualPlayer.classList.contains(player.animationDirection)) {
    visualPlayer.classList.remove("up", "down", "left", "right");
    visualPlayer.classList.add(player.animationDirection);
  }

  // add walking animation class after the hit animation is done
  if (player.collision) {
    if (!visualPlayer.classList.contains("hit")) {
      visualPlayer.classList.add("hit");
      hitAnimationActive = true;

      // Remove the hit class after a few seconds
      setTimeout(() => {
        visualPlayer.classList.remove("hit");
        hitAnimationActive = false;
        // Reapply the animation direction class
        visualPlayer.classList.add(player.animationDirection);
      }, 1000);
    }
  }
}

function displayEnemyAnimation() {
  const visualEnemy = document.querySelector("#enemy");

  if (!enemy.moving) {
    visualEnemy.classList.remove("animate");
  } else if (!visualEnemy.classList.contains("animate")) {
    visualEnemy.classList.add("animate");
  }

  if (enemy.animationDirection && !visualEnemy.classList.contains(enemy.animationDirection)) {
    visualEnemy.classList.remove("left", "right");
    visualEnemy.classList.add(enemy.animationDirection);
  }
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
  const visualPlayer = document.querySelector("#player");

  if (player.collision) {
    collisionInfo.textContent = "You're HIT!!";
    collisionInfo.classList.add("collision");

    if (!visualPlayer.classList.contains("hit")) {
      visualPlayer.classList.add("hit");

      // Remove the hit class after 5 seconds
      setTimeout(() => {
        visualPlayer.classList.remove("hit");
      }, 2000);
    }
  } else {
    collisionInfo.textContent = "";
    collisionInfo.classList.remove("collision");
  }
}
