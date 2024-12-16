// https://adventofcode.com/2024/day/15
const { readFile } = require("../io");

const Move = {
  UP: "^",
  DOWN: "v",
  RIGHT: ">",
  LEFT: "<",
};

const Vectors = {
  [Move.UP]: [-1, 0],
  [Move.DOWN]: [1, 0],
  [Move.RIGHT]: [0, 1],
  [Move.LEFT]: [0, -1],
};

const Tile = {
  ROBOT: "@",
  BOX: "O",
  WALL: "#",
  EMPTY: ".",
  BIG_BOX_L: "[",
  BIG_BOX_R: "]",
};

const parse = (input, resize = false) => {
  let robot;
  let [map, moves] = input.split("\n\n");

  if (resize) {
    map = map.replaceAll("#", "##");
    map = map.replaceAll(".", "..");
    map = map.replaceAll("O", "[]");
    map = map.replaceAll("@", "@.");
  }

  map = map.split("\n").map((row, rowIndex) => {
    const tiles = row.split("");
    const colIndex = tiles.findIndex((tile) => tile === Tile.ROBOT);
    if (colIndex !== -1) {
      robot = [rowIndex, colIndex];
    }
    return tiles;
  });
  moves = moves.replaceAll("\n", "").split("");

  return [map, robot, moves];
};

const display = (map, highlight, vector) => {
  if (highlight) {
    map = structuredClone(map);
    map[highlight[0]][highlight[1]] = vector;
  }
  console.log(map.map((row) => row.join("")).join("\n"), "\n");
};

const next = (current, vector) => [
  current[0] + vector[0],
  current[1] + vector[1],
];

const switchTiles = (map, tileA, tileB) => {
  const valueA = map[tileA[0]][tileA[1]];
  const valueB = map[tileB[0]][tileB[1]];

  map[tileA[0]][tileA[1]] = valueB;
  map[tileB[0]][tileB[1]] = valueA;

  return map;
};

const attemptMoveRobot = (map, position, vector) => {
  const isVerticalMove = [Vectors[Move.UP], Vectors[Move.DOWN]].includes(
    vector
  );
  let tiles = [position];
  let changes = [];
  let canMove = undefined;

  while (canMove === undefined) {
    tiles.forEach((tile) => changes.unshift(tile));
    tiles = Object.values(
      tiles.reduce((acc, currentTileCoords) => {
        const currentTile = map[currentTileCoords[0]][currentTileCoords[1]];
        const nextTileCoords = next(currentTileCoords, vector);
        const nextTile = map[nextTileCoords[0]][nextTileCoords[1]];

        if (nextTile !== Tile.EMPTY) {
          acc[nextTileCoords.join("")] = nextTileCoords;
        }

        if (isVerticalMove) {
          if (nextTile === Tile.BIG_BOX_L && currentTile !== nextTile) {
            const partial = next(nextTileCoords, Vectors[Move.RIGHT]);
            acc[partial.join("")] = partial;
          }
          if (nextTile === Tile.BIG_BOX_R && currentTile !== nextTile) {
            const partial = next(nextTileCoords, Vectors[Move.LEFT]);
            acc[partial.join("")] = partial;
          }
        }

        return acc;
      }, {})
    );

    if (tiles.some((tile) => map[tile[0]][tile[1]] === Tile.WALL)) {
      canMove = false;
    }

    if (
      tiles.length === 0 ||
      (tiles.length === 1 && tiles.at(0) === tiles.EMPTY)
    ) {
      canMove = true;
    }
  }

  if (canMove) {
    changes.forEach((tile) => {
      const to = next(tile, vector);
      switchTiles(map, tile, to);
    });

    return [map, next(position, vector)];
  }

  return [map, position];
};

const firstTask = (input) => {
  let [map, robot, moves] = parse(input);

  while (moves.length > 0) {
    [map, robot] = attemptMoveRobot(map, robot, Vectors[moves.shift()]);
  }

  return map.reduce(
    (gps, row, rowIndex) =>
      row.reduce((result, tile, colIndex) => {
        if (tile === Tile.BOX) {
          result += 100 * rowIndex + colIndex;
        }
        return result;
      }, gps),
    0
  );
};

const secondTask = (input) => {
  let [map, robot, moves] = parse(input, true);

  while (moves.length > 0) {
    [map, robot] = attemptMoveRobot(map, robot, Vectors[moves.shift()]);
  }
  return map.reduce(
    (gps, row, rowIndex) =>
      row.reduce((result, tile, colIndex) => {
        if (tile === Tile.BIG_BOX_L) {
          return (result += rowIndex * 100 + colIndex);
        }
        return result;
      }, gps),
    0
  );
};

console.log(firstTask(readFile("./src/15/input")));
console.log(secondTask(readFile("./src/15/input")));
