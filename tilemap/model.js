// pos = x,y i px
// coor = row, col in tiles

const tiles = [
  [0, 0, 0, 0, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 2, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 2, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 1, 1, 0, 0, 2, 2, 0]
];

const GRID_HEIGHT = tiles.length;
const GRID_WIDTH = tiles[0].length;
const TILE_SIZE = 32;

// returnerer den tileværdi der er i modellen på row, col
function getTileAtCoord({ row, col }) {
  if (row >= 0 && row < GRID_HEIGHT && col >= 0 && col < GRID_WIDTH) {
    return tiles[row][col];
  } else {
    return null;
  }
}
console.log("getTileAtCoord:", getTileAtCoord({ row: 2, col: 3 }));

// returnerer den tileværdi der er i modellen på den
// row, col der beregnes ud fra x, y positionen
function getTileAtPos({ x, y }) {
  const coord = coordFromPos({ x: x, y: y });
  return getTileAtCoord({ row: coord.row, col: coord.col });
}
console.log("getTileAtPos:", getTileAtPos({ x: 96, y: 64 }));

// returnerer en row, col koordinat ud fra en x, y position
function coordFromPos({ x, y }) {
  const row = Math.floor(y / TILE_SIZE);
  const col = Math.floor(x / TILE_SIZE);

  return { row, col };
}
console.log("coordFromPos:", coordFromPos({ x: 96, y: 64 }));

// returnerer en x,y position ud fra en row, col koordinate
function posFromCoord({ row, col }) {
  const x = Math.floor(col * TILE_SIZE);
  const y = Math.floor(row * TILE_SIZE);

  return { x, y };
}
console.log("posFromCoord:", posFromCoord({ row: 2, col: 3 }));
