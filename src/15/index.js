// https://adventofcode.com/2024/day/15
const { readFile } = require("../io");

const data = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`.trim();

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

const display = (map) =>
  console.log(map.map((row) => row.join("")).join("\n"), "\n");
const switchTiles = (map, tileA, tileB) => {
  const valueA = map[tileA[0]][tileA[1]];
  const valueB = map[tileB[0]][tileB[1]];

  map[tileA[0]][tileA[1]] = valueB;
  map[tileB[0]][tileB[1]] = valueA;

  return map;
};
const attemptMoveBox = (map, box, vector) => {
  const nextTileCoords = [box[0] + vector[0], box[1] + vector[1]];
  const nextTile = map[nextTileCoords[0]][nextTileCoords[1]];

  if (nextTile === Tile.WALL) {
    return false;
  }

  if (nextTile === Tile.BOX) {
    if (!attemptMoveBox(map, nextTileCoords, vector)) {
      return false;
    }
  }

  switchTiles(map, box, nextTileCoords);
  return true;
};

const attemptMoveBigBox = (map, box, vector) => {
  const current = map[box[0]][box[1]];
  const [leftSide, rightSide] =
    current === Tile.BIG_BOX_L
      ? [box, [box[0], box[1] + 1]]
      : [[box[0], box[1] - 1], box];
};

const attemptMoveRobot = (map, robot, move) => {
  const vector = Vectors[move];
  const nextTileCoords = [robot[0] + vector[0], robot[1] + vector[1]];
  const nextTile = map[nextTileCoords[0]][nextTileCoords[1]];

  if ([Tile.BIG_BOX_L, Tile.BIG_BOX_R].includes(nextTile)) {
    if (attemptMoveBox(map, nextTileCoords, vector)) {
      return attemptMoveRobot(map, robot, move);
    }
  }

  if (nextTile === Tile.BOX) {
    if (attemptMoveBox(map, nextTileCoords, vector)) {
      return attemptMoveRobot(map, robot, move);
    }
  }

  if (nextTile === Tile.EMPTY) {
    return [switchTiles(map, robot, nextTileCoords), nextTileCoords];
  }

  return [map, robot];
};

const firstTask = (input) => {
  let [map, robot, moves] = parse(input);

  while (moves.length > 0) {
    [map, robot] = attemptMoveRobot(map, robot, moves.shift());
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
    console.log("Move: ", moves.at(0));
    [map, robot] = attemptMoveRobot(map, robot, moves.shift());
    display(map);
  }
};

// console.log(firstTask(readFile("./src/15/input")))
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/15/input")))
