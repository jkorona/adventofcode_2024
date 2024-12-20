// https://adventofcode.com/2024/day/20
const { PriorityQueue, MinHeap } = require("../collections");
const { readFile } = require("../io");
const { directions, withinMatrix } = require("../utils");

// const data = `
// ###############
// #...#...#.....#
// #.#.#.#.#.###.#
// #S#...#.#.#...#
// #######.#.#.###
// #######.#.#...#
// #######.#.###.#
// ###..E#...#...#
// ###.#######.###
// #...###...#...#
// #.#####.#.###.#
// #.#...#.#.#...#
// #.#.#.#.#.#.###
// #...#...#...###
// ###############
// `.trim();

const data = `
#####
#...#
#S#E#
#####
`.trim();

const parse = (input) => {
  let start, end;
  const racetrack = input.split("\n").map((row, rowIndex) => {
    return row.split("").map((tile, colIndex) => {
      const pos = [rowIndex, colIndex];
      if (tile === "S") {
        start = pos;
      }
      if (tile === "E") {
        end = pos;
      }
      return tile;
    });
  });
  return [racetrack, start, end];
};

const getDistance = ([x1, y1], [x2, y2]) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const findPath = (grid, start, end, unallowedChar = "#") => {
  const rows = grid.length;
  const cols = grid[0].length;

  function isValid(x, y) {
    return withinMatrix([y, x], cols, rows) && grid[x][y] !== unallowedChar;
  }

  const openSet = new MinHeap();
  openSet.push({
    pos: start,
    gCost: 0,
    fCost: getDistance(start, end),
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
        const hCost = getDistance([newX, newY], end);
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

const find2NSShortcuts = (racetrack, path, expectedSave = 0) => {
  const results = [];
  const [start, end] = [path.at(0), path.at(-1)];
  const currentLength = path.length;
  const visited = Array.from({ length: racetrack.length }, () =>
    new Array(racetrack[0].length).fill(false)
  );

  while (path.length !== 0) {
    const current = path.shift();

    for (const [dy, dx] of directions) {
      const [row, col] = [current[0] + dy, current[1] + dx];
      const value = racetrack[row][col];
      if (
        value === "#" &&
        !visited[row][col] &&
        row !== 0 &&
        col !== 0 &&
        row !== racetrack.length - 1 &&
        col !== racetrack[0].length - 1
      ) {
        racetrack[row][col] = ".";
        const pathWithShortcut = findPath(racetrack, start, end);
        const newLength = pathWithShortcut.length;
        if (
          newLength < currentLength &&
          currentLength - newLength >= expectedSave
        ) {
          results.push(newLength);
        }
        racetrack[row][col] = "#";
      }
      visited[row][col] = true;
    }
  }
  return results;
};

const collectAllValidDistances = (path) => {
  const pairs = new Map();
  const makeKey = (a, b) => a.concat(b).sort().join("|");

  for (let startIndex = 0; startIndex < path.length; startIndex++) {
    for (let endIndex = 0; endIndex < path.length; endIndex++) {
      if (endIndex !== startIndex) {
        const startTile = path[startIndex];
        const endTile = path[endIndex];
        const key = makeKey(startTile, endTile);
        if (!pairs.has(key)) {
          const distance = getDistance(startTile, endTile);
          if (distance > 1 && distance <= 20) {
            pairs.set(key, [startTile, endTile, distance]);
          }
        }
      }
    }
  }
  ``;
  return Array.from(pairs.values());
};

const find20NSShortcuts = (racetrack, candidates, pathLength) => {
  const shortcuts = [];

  for (let index = 0; index < candidates.length; index++) {
    const [start, end, distance] = candidates[index];

    racetrack[start[0]][start[1]] = "S";
    racetrack[end[0]][end[1]] = "E";

    const shortcut = findPath(racetrack, start, end, ".");
    if (shortcut.length === distance + 1) { // add start node
      shortcut.forEach(([row, col]) => (racetrack[row][col] = "."));
      const pathWithShortcut = findPath(racetrack, start, end);
      if (pathWithShortcut.length < pathLength) {
        shortcuts.push(pathWithShortcut);
      }
      shortcut.forEach(([row, col]) => (racetrack[row][col] = "#"));
    }
    racetrack[start[0]][start[1]] = ".";
    racetrack[end[0]][end[1]] = ".";
  }

  return shortcuts;
};

const firstTask = (input) => {
  const [racetrack, start, end] = parse(input);
  const path = findPath(racetrack, start, end);
  return find2NSShortcuts(racetrack, path, 100).length;
};

const secondTask = (input) => {
  const [racetrack, start, end] = parse(input);
  const path = findPath(racetrack, start, end);

  const x = find20NSShortcuts(
    racetrack,
    collectAllValidDistances(path),
    path.length
  );
  return x;
  // return find20NSShortcuts(racetrack, collectAllValidDistances(path), path.length).reduce(
  //   (acc, p) => {
  //     if (!acc[path.length - p.length]) {
  //       acc[path.length - p.length] = 0;
  //     }
  //     acc[path.length - p.length] += 1;
  //     return acc;
  //   },
  //   {}
  // );
};

// console.log(firstTask(data));
// console.log(firstTask(readFile("./src/20/input")));
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/20/input")))
