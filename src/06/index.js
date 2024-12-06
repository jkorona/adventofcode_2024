const readFile = require("../io");
const { measureTime } = require("../utils");

const stop = measureTime();

const directions = {
  ["^"]: [0, -1],
  [">"]: [+1, 0],
  ["v"]: [0, +1],
  ["<"]: [-1, 0],
};

const markers = Object.keys(directions);

const parse = (input) => {
  let start;
  const map = input.split("\n").map((line, y) =>
    line.split("").map((value, x) => {
      const isStart = markers.includes(value);
      if (isStart) {
        start = {
          position: [x, y],
          direction: directions[value],
          marker: value,
        };
      }
      return { value, visited: isStart };
    })
  );
  return { map, start };
};

const isOutOfBounds = (map, x, y) =>
  y < 0 || y >= map.length || x < 0 || x >= map[0].length;
const isObstacle = (map, x, y) => map[y][x].value === "#";

const checkRoute = (map, start) => {
  let end = false;
  let { position, direction, marker } = start;
  let counter = 0;
  while (!end) {
    const [x, y] = [position[0] + direction[0], position[1] + direction[1]];
    counter++;
    if (isOutOfBounds(map, x, y)) {
      end = true;
    } else if (isObstacle(map, x, y)) {
      marker = markers[(markers.indexOf(marker) + 1) % 4];
      direction = directions[marker];
    } else {
      const cell = map[y][x];
      if (cell.visited && cell.prevMarker === marker) {
        return []; // entered infinite loop
      }
      cell.visited = true;
      cell.prevMarker = marker;
      position = [x, y];
    }
  }

  return map.reduce((path, line, y) => {
    return [
      ...path,
      ...line.reduce(
        (acc, cell, x) => (cell.visited ? [...acc, [x, y]] : acc),
        []
      ),
    ];
  }, []);
};

const cloneMap = (map, changes = null) => {
  const clone = structuredClone(map);
  if (changes) {
    const [x, y] = changes;
    clone[y][x] = { value: "#", visited: false };
  }
  return clone;
};

const firstTask = (input) => {
  const { map, start } = parse(input);

  return checkRoute(map, start).length;
};

const secondTask = (input) => {
  const { map, start } = parse(input);
  const path = checkRoute(cloneMap(map), start);

  let loops = 0;
  for (const coords of path) {
    if (!(coords[0] === start.position[0] && coords[1] === start.position[1])) {
      if (checkRoute(cloneMap(map, coords), start).length === 0) {
        loops++;
      }
    }
  }

  return loops;
};

console.log(firstTask(readFile("./src/06/input")));
console.log(secondTask(readFile("./src/06/input")));

stop();
