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
