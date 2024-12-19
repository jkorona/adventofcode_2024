module.exports.measureTime = () => {
  const start = process.hrtime();
  return () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    console.log(`Execution Time: ${seconds}s ${nanoseconds / 1e6}ms`);
  };
};

module.exports.sum = (numbers) => numbers.reduce((sum, number) => sum + number);
module.exports.withinMatrix = ([x, y], width, height) =>
  x > -1 && y > -1 && x < width && y < height;

module.exports.repeat = (value, times) =>
  Array.from({ length: times }, () => value);

module.exports.directions = [
  [0, 1, 0], // right
  [1, 0, 1], // down
  [0, -1, 2], // left
  [-1, 0, 3], // up
];

module.exports.printGrid = (grid, delimeter = " ") =>
  grid.forEach((line) => console.log(line.join(delimeter)));
