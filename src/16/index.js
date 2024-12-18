// https://adventofcode.com/2024/day/16
const { readFile } = require("../io");
const { sum } = require("../utils");

const parse = (input) => {
  let start, end;
  const maze = input.split("\n").map((row, rowIndex) => {
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
  return [maze, start, end];
};

class PriorityQueue {
  constructor() {
    this.queue = [];
  }
  enqueue(item, priority) {
    this.queue.push({ item, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.queue.shift().item;
  }
  isEmpty() {
    return this.queue.length === 0;
  }
}

const key = (point) => point.join("|");
const directions = [
  [0, 1, 0], // right
  [1, 0, 1], // down
  [0, -1, 2], // left
  [-1, 0, 3], // up
];

const dijkstra = (maze, start, end) => {
  const paths = [];
  const pq = new PriorityQueue();

  const cost = Array.from({ length: maze.length }, () =>
    Array.from({ length: maze[0].length }, () => Array(4).fill(Infinity))
  );

  pq.enqueue([start[0], start[1], 0, 0, [key(start)]], 0);

  while (!pq.isEmpty()) {
    const [x, y, dir, currentCost, path] = pq.dequeue();

    if (x === end[0] && y === end[1]) {
      paths.push({ cost: currentCost, path });
    }

    for (const [dx, dy, newDir] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (maze[newX][newY] !== "#") {
        const additionalCost = dir === newDir ? 1 : 1001;
        const newCost = currentCost + additionalCost;

        if (newCost <= cost[newX][newY][newDir]) {
          cost[newX][newY][newDir] = newCost;
          pq.enqueue(
            [newX, newY, newDir, newCost, [...path, key([newX, newY])]],
            newCost
          );
        }
      }
    }
  }

  return paths;
};

const firstTask = (input) => {
  const [maze, start, end] = parse(input);
  const paths = dijkstra(maze, start, end);
  return paths.at(0)?.cost;
};

const secondTask = (input) => {
  const [maze, start, end] = parse(input);
  const paths = dijkstra(maze, start, end);

  const sortedPaths = paths.sort((a, b) => a.score - b.score);
  const minCost = sortedPaths[0].cost;

  const uniqueTiles = sortedPaths
    .filter(({ cost }) => cost === minCost)
    .flatMap(({ path }) => path);
  return new Set(uniqueTiles).size;
};

console.log(firstTask(readFile("./src/16/input")));
console.log(secondTask(readFile("./src/16/input")));
