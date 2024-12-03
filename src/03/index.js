const readFile = require("../io");

const data =
  "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

const firstTask = (input) => {
  let result = 0;
  const regexp = /mul\((\d+,\d+)\)/g;
  while ((matches = regexp.exec(input)) !== null) {
    const [a, b] = matches[1].split(",").map((v) => parseInt(v, 10));
    result += a * b;
  }
  return result;
};

const secondTask = (input) => {
  let result = 0;
  let enabled = true;
  const regexp = /(?:mul\((\d+,\d+)\))|(?:(do(?:n\'t)?\(\)))/g;
  while ((matches = regexp.exec(input)) !== null) {
    switch (matches[0]) {
      case "do()":
        enabled = true;
        break;
      case "don't()":
        enabled = false;
        break;
      default: {
        if (enabled) {
          const [a, b] = matches[1].split(",").map((v) => parseInt(v, 10));
          result += a * b;
        }
      }
    }
  }
  return result;
};

console.log(firstTask(readFile("./src/03/input")));
console.log(secondTask(readFile("./src/03/input")));
