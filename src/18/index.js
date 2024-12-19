// https://adventofcode.com/2024/day/18
const { MinHeap } = require("../collections");
const { readFile } = require("../io");
const { directions, withinMatrix } = require("../utils");

const parse = (input) =>
  input.split("\n").map((row) => row.split(",").map(Number));

const createGrid = (width, height) =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ".")
  );

const aStar = (grid, start, end) => {
  const rows = grid.length;
  const cols = grid[0].length;

  function isValid(x, y) {
    return withinMatrix([y, x], cols, rows) && grid[x][y] !== "#";
  }

  function heuristic([x1, y1], [x2, y2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  const openSet = new MinHeap();
  openSet.push({
    pos: start,
    gCost: 0,
    fCost: heuristic(start, end),
    path: [start],
  });

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    const [x, y] = current.pos;

    if (x === end[0] && y === end[1]) {
      return current.path;
    }

    visited[x][y] = true;

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (isValid(newX, newY) && !visited[newX][newY]) {
        const gCost = current.gCost + 1;
        const hCost = heuristic([newX, newY], end);
        const fCost = gCost + hCost;

        openSet.push({
          pos: [newX, newY],
          gCost,
          fCost,
          path: [...current.path, [newX, newY]],
        });
      }
    }
  }

  return [];
};

const firstTask = (input) => {
  const coords = parse(input);
  const grid = createGrid(71, 71);

  coords.slice(0, 1024).forEach(([x, y]) => (grid[y][x] = "#"));
  return aStar(grid, [0, 0], [70, 70]).length - 1;
};

const secondTask = (input) => {
  const coords = parse(input);
  const grid = createGrid(71, 71);

  let isOK = true;
  let index = 1024;
  coords.slice(0, index).forEach(([x, y]) => (grid[y][x] = "#"));

  while (isOK) {
    const nextByte = coords[++index];
    
    if (nextByte === undefined) {
      return 0;
    }

    grid[nextByte[1]][nextByte[0]] = "#";
    const path = aStar(grid, [0, 0], [70, 70]);
    isOK = path.length > 0;
  }
  return coords[index].join(",");
};

console.log(firstTask(readFile("./src/18/input")));
console.log(secondTask(readFile("./src/18/input")));
