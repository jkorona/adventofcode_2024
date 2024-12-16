// https://adventofcode.com/2024/day/14
const { readFile } = require("../io");

const parse = (input) =>
  input
    .split("\n")
    .map((line) =>
      /p=([-]?\d+),([-]?\d+) v=([-]?\d+),([-]?\d+)/
        .exec(line)
        .slice(1)
        .map((v) => parseInt(v))
    )
    .map((values) => ({
      position: values.slice(0, 2),
      velocity: values.slice(2, 4),
    }));

const moveTimes = ({ position, velocity }, seconds, map) => {
  const sum = (number, times) => {
    let result = 0;
    for (let index = 0; index < times; index++) {
      result += number;
    }
    return result;
  };

  const round = (number, size) => {
    const mul = number % size;
    return Math.abs(mul < 0 ? size + mul : mul);
  };

  return [
    round(position[0] + sum(velocity[0], seconds), map.width),
    round(position[1] + sum(velocity[1], seconds), map.height),
  ];
};

const firstTask = (input, width = 11, height = 7, seconds) => {
  const robots = parse(input);

  const positionsAferXs = robots.map((robot) =>
    moveTimes(robot, seconds, { width, height })
  );

  const vMiddle = Math.floor(width / 2);
  const hMiddle = Math.floor(height / 2);
  const quadrants = [
    { from: [0, 0], to: [vMiddle, hMiddle] },
    { from: [width - vMiddle, 0], to: [width, hMiddle] },
    { from: [0, height - hMiddle], to: [vMiddle, height] },
    { from: [width - vMiddle, height - hMiddle], to: [width, height] },
  ];
  return positionsAferXs
    .reduce(
      (safetyFactor, position) => {
        const quadrant = quadrants.findIndex(({ from, to }) => {
          return (
            position[0] >= from[0] &&
            position[0] < to[0] &&
            position[1] >= from[1] &&
            position[1] < to[1]
          );
        });
        if (quadrant !== -1) {
          safetyFactor[quadrant] += 1;
        }
        return safetyFactor;
      },
      [0, 0, 0, 0]
    )
    .reduce((prev, next) => prev * next);
};

const draw = (positions, width, height) => {
  const canvas = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );

  positions.forEach(([x, y]) => (canvas[y][x] = canvas[y][x] + 1));

  console.clear();
  console.log("_".repeat(101));
  canvas.forEach((line) => console.log(line.join("").replaceAll('0', '.')));
};

const secondTask = (input) => {
  /**
   * DRAWING VERSION
   */

  // const [width, height] = [101, 103];
  // const robots = parse(input);

  // let iteration = 0
  // setInterval(() => {
  //   const positions = robots.map((robot) =>
  //     moveTimes(robot, iteration, { width, height })
  //   );
  //   draw(positions, width, height);
  //   console.log(`After ${iteration} iterations`);
  //   iteration++
  // }, 1000);

  /**
   * MIN SAFETY FACTOR VERSION
   */

  let min = [Number.MAX_SAFE_INTEGER, 0]

  for (let index = 0; index < 10000; index++) {
    const sf = firstTask(input, 101, 103, index);
    if (sf < min[0]) {
      min = [sf, index]
    }
  }

  return min[1];
};

// console.log(firstTask(data));
// console.log(firstTask(readFile("./src/14/input"), 101, 103));
// console.log(secondTask(data));
secondTask(readFile("./src/14/input"));
