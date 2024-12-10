const { readFile } = require("../io");
const { withinMatrix } = require("../utils");

const parse = (input) => {
  const heads = [];
  const map = input.split("\n").map((line, row) =>
    line.split("").map((value, col) => {
      const number = parseInt(value, 10);
      if (number === 0) {
        heads.push([row, col]);
      }
      return number;
    })
  );
  return { map, heads };
};
const vectors = [
  [-1, 0], // UP
  [0, +1], // RIGHT
  [+1, 0], // DOWN
  [0, -1], // LEFT
];
const calculateTrails = (map, trail, height) => {
  const [mapWidth, mapHeight] = [map[0].length, map.length];
  const trails = [];

  vectors.forEach((vector) => {
    const point = trail.at(-1);
    const [row, column] = [point[0] + vector[0], point[1] + vector[1]];
    if (
      withinMatrix([column, row], mapHeight, mapWidth) &&
      map[row][column] === height
    ) {
      const extendedTrail = [...trail, [row, column]];
      if (height === 9) {
        trails.push(extendedTrail);
      } else {
        trails.push(...calculateTrails(map, extendedTrail, height + 1));
      }
    }
  });
  return trails;
};

const firstTask = (input) => {
  const { map, heads } = parse(input);

  return heads.reduce((sum, head) => {
    const trails = calculateTrails(map, [head], 1);
    const uniqueEnds = new Set(trails.map((trail) => trail.at(-1).join(','))).size;
    return sum + uniqueEnds;
  }, 0);
};

const secondTask = (input) => {
  const { map, heads } = parse(input);

  return heads.reduce((sum, head) => {
    const trails = calculateTrails(map, [head], 1);
    return sum + trails.length;
  }, 0);
};

console.log(firstTask(readFile('./src/10/input')));
console.log(secondTask(readFile('./src/10/input')));
