const { readFile } = require("../io");

const data = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`.trim();

const parse = (input) => {
  const lines = input.split(/[\r\n]/);
  return lines.map((line) => line.split(/\s+/).map((s) => parseInt(s, 10)));
};

const isSafe = (report) => {
  let direction = 0;
  for (let index = 1; index < report.length; index++) {
    const prev = report[index - 1];
    const current = report[index];
    const distance = current - prev;

    if (![1, 2, 3].includes(Math.abs(distance))) {
      return false;
    }

    const trend = distance > 0 ? 1 : -1;
    if (direction && direction !== trend) {
      return false;
    }

    direction = trend;
  }
  return true;
};

const isSafeWithProblemDampener = (report) => {
  if (!isSafe(report)) {
    return report.some((_, index) => {
      return isSafe(report.toSpliced(index, 1));
    });
  }
  return true;
};

const firstTask = (input) => parse(input).filter(isSafe).length;
const secondTask = (input) =>
  parse(input).filter(isSafeWithProblemDampener).length;

console.log(firstTask(readFile("./src/02/input")));
console.log(secondTask(readFile("./src/02/input")));
