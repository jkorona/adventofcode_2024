// https://adventofcode.com/2024/day/16
const { readFile } = require("../io");
const { sum } = require("../utils");

const data = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`.trim();

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

const dijkstra = (maze, start, end) => {
  const directions = [
    [0, 1, 0],  // right
    [1, 0, 1],  // down
    [0, -1, 2], // left
    [-1, 0, 3], // up
  ];

  const pq = new PriorityQueue();

  const cost = Array.from({ length: maze.length }, () =>
    Array.from({ length: maze[0].length }, () => Array(4).fill(Infinity))
  );

  for (let i = 0; i < 4; i++) {
    pq.enqueue([start[0], start[1], i, i === 0 ? 1 : 1000], 0);
    cost[start[0]][start[1]][i] = 0;
  }

  while (!pq.isEmpty()) {
    const [x, y, dir, currentCost] = pq.dequeue();

    if (x === end[0] && y === end[1]) {
      return currentCost;
    }

    for (const [dx, dy, newDir] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (maze[newX][newY] !== '#') {
        const additionalCost = dir === newDir ? 1 : 1 + 1000;
        const newCost = currentCost + additionalCost;

        if (newCost < cost[newX][newY][newDir]) {
          cost[newX][newY][newDir] = newCost;
          pq.enqueue([newX, newY, newDir, newCost], newCost);
        }
      }
    }
  }

  return -1;
  
};

const firstTask = (input) => {
  const [maze, start, end] = parse(input);
  return dijkstra(maze, start, end);
};

const secondTask = (input) => 0;

// console.log(firstTask(data));
console.log(firstTask(readFile("./src/16/input")));
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/16/input")))
