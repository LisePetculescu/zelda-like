window.addEventListener("load", start);

let player = {
  x: 100,
  y: 100,
  speed: 70, // px/s
  width: 30,
  height: 40
};

let enemy = {
  x: 200,
  y: 200,
  speed: 0,
  width: 30,
  height: 40
};

const gameField = {
  width: 400,
  height: 400
};

let controls = {
  up: false,
  down: false,
  left: false,
  right: false
};

function start() {
  console.log("start.. ");

  // displayPlayer();

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
  // moveEnemy(deltaTime);

  // check collisions
  if (isColliding(player, enemy)) {
    player.collision = true;
    enemy.collision = true;
  } else {
    player.collision = false;
    enemy.collision = false;
  }

  // update display
  displayPlayer();
  displayEnemy();
  // displayCollisionInfo();
}

// lav check om midlertidig position er lovlig
function movePlayer(deltaTime) {
  const position = { x: player.x, y: player.y };
  let deltaY = 0;
  let deltaX = 0;

  if (controls.up) {
    deltaY -= player.speed * deltaTime;
  } else if (controls.down) {
    deltaY += player.speed * deltaTime;
  }
  if (controls.left) {
    deltaX -= player.speed * deltaTime;
  } else if (controls.right) {
    deltaX += player.speed * deltaTime;
  }

  if (deltaX != 0 && deltaY != 0) {
    // console.log("player bevæger sig diagonalt");

    const dist = Math.hypot(deltaX, deltaY);
    // const dist = 1.4142;

    // console.log("dist hpot: ", dist);

    deltaX = deltaX / dist;
    deltaY = deltaY / dist;
  }

  position.x += deltaX;
  position.y += deltaY;

  if (canMove(player, position)) {
    player.x = position.x;
    player.y = position.y;
  }
}

// function moveEnemy(deltaTime) {}

function canMove(player, position) {
  if (position.x < -2 || position.y < -2 || position.x > gameField.width - player.width || position.y > gameField.height - player.height) return false;

  return true;
}

function isColliding(player, enemy) {
  // check if bottom of player hits top of enemy
  const belowTop = player.y + player.h >= enemy.y;

  // check if top of player hits bottom of enemy
  const aboveBottom = player.y <= enemy.y + enemy.h;

  // check if player's right side hits enemy's left side |P|-->|E|
  const afterLeft = player.x + player.w >= enemy.x;

  // check if player's left side hits enemy's right side |E|-->|P|
  const beforeRight = player.x <= enemy.x + enemy.w;

  // Only if all four conditions are met, are the player and enemy colliding
  return belowTop && aboveBottom && afterLeft && beforeRight;
}

// function displayCollisionInfo() {
//   const collisionInfo = document.querySelector("#collision-status");
//   if (player.collision) {
//     collisionInfo.textContent = "Collision!!";
//     collisionInfo.classList.add("collision");
//   } else {
//     collisionInfo.textContent = "No collision ...";
//     collisionInfo.classList.remove("collision");
//   }
// }
