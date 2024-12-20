// https://adventofcode.com/2024/day/20
const { MinHeap } = require("../collections");
const { readFile } = require("../io");
const { directions, withinMatrix } = require("../utils");

const data = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
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
  const pairs = [];
  for (let startIndex = 0; startIndex < path.length - 1; startIndex++) {
    for (let endIndex = startIndex + 1; endIndex < path.length; endIndex++) {
      const startTile = path[startIndex];
      const endTile = path[endIndex];
      const distance = getDistance(startTile, endTile);
      if (distance > 1 && distance <= 20) {
        pairs.push([startTile, endTile, distance]);
      }
    }
  }

  return pairs;
};

const find20NSShortcuts = (candidates, path) => {
  const shortcutDurations = [];

  for (let index = 0; index < candidates.length; index++) {
    const [start, end, distance] = candidates[index];

    let pointer = 0;
    let duration = 0;

    while (pointer !== path.length) {
      let [row, col] = path[pointer];
      if (row === start[0] && col === start[1]) {
        while (row !== end[0] || col !== end[1]) {
          [row, col] = path[++pointer];
        }
        duration += distance;
      } else {
        pointer++;
        duration++;
      }
    }
    shortcutDurations.push(duration);
  }
  return shortcutDurations;
};

const firstTask = (input) => {
  const [racetrack, start, end] = parse(input);
  const path = findPath(racetrack, start, end);
  return find2NSShortcuts(racetrack, path, 100).length;
};

const secondTask = (input) => {
  const [racetrack, start, end] = parse(input);
  const path = findPath(racetrack, start, end);

  const shortcuts = find20NSShortcuts(
    collectAllValidDistances(path),
    path
  ).filter((distance) => path.length - distance >= 100);
  return shortcuts.length;
};

console.log(firstTask(readFile("./src/20/input")));
console.log(secondTask(readFile("./src/20/input")));
