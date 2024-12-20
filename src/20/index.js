// https://adventofcode.com/2024/day/20
const { PriorityQueue, MinHeap } = require("../collections");
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

/**
 * TODO:
 * Uzyc prostego DSFa, krok po kroku przechodzić sciezke az dojdziesz do "wejscia w skrot".
 * Wtedy przeskoczyc do wyjscia i isc dalej do konca, w sumie mozna uzyc tez gotowej sciezki!!!
 * Wystarczy obliczyc dystansy!!
 */

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

const makeKey = (a, b) => JSON.stringify([a, b]);

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

const find20NSShortcuts = (racetrack, candidates, path) => {
  const shortcuts = [];
  const checked = new Map();
  const copy = Array.from({ length: racetrack.length }, () =>
    new Array(racetrack[0].length).fill(".")
  );

  for (let index = 0; index < candidates.length; index++) {
    const [start, end] = candidates[index];
    // find shortest path from start to end of shortcut
    const shortcut = findPath(copy, start, end);
    // check if we don't already have this shortcut (start <-> end) on the list
    const key = makeKey(shortcut.at(0), shortcut.at(-1));
    if (
      !checked.has(key) &&
      shortcut.some(([row, col]) => racetrack[row][col] === "#")
    ) {
      // clean path for the shortcut
      shortcut.forEach(([row, col]) => (racetrack[row][col] = "."));
      // check new distance with shortcut
      const pathWithShortcut = findPath(racetrack, path.at(0), path.at(-1));
      // if this shortcut really makes distance shorter store it on the results list
      if (
        pathWithShortcut.length > 0 &&
        pathWithShortcut.length < path.length
      ) {
        shortcuts.push(pathWithShortcut);
      }
      // restore racetrack to previous state
      shortcut.slice(1, -1).forEach(([row, col]) => (racetrack[row][col] = "#"));
      // store information that we already checked this shortcut
      checked.set(key, true);
    }
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

  return find20NSShortcuts(
    racetrack,
    collectAllValidDistances(path),
    path
  ).reduce((acc, p) => {
    const save = path.length - p.length;
    if (save < 50) {
      return acc;
    }
    if (!acc[save]) {
      acc[save] = 0;
    }
    acc[save] += 1;
    return acc;
  }, {});
};

// console.log(firstTask(data));
// console.log(firstTask(readFile("./src/20/input")));
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/20/input")))
