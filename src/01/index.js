const fs = require("fs");

const data = `
3   4
4   3
2   5
1   3
3   9
3   3
`.trim();

const readFile = (path) => {
  return fs.readFileSync(path, "utf8");
};

const parse = (input) => {
  return input.split(/[\n\r]/).reduce(
    ([left, right], line) => {
      const [x, y] = line.split(/\s+/).map((s) => parseInt(s, 10));
      return [
        [...left, x],
        [...right, y],
      ];
    },
    [[], []]
  );
};

const firstTask = (input) => {
  const [left, right] = parse(input);
  left.sort();
  right.sort();

  const size = right.length;
  let sum = 0;

  for (let index = 0; index < size; index++) {
    const a = left[index];
    const b = right[index];
    const distance = Math.abs(a - b);
    sum += distance;
  }

  return sum;
};

const findOccurrences = (input) => input.reduce((occurrencesMap, num) => {
  if (occurrencesMap.has(num)) {
    occurrencesMap.set(num, occurrencesMap.get(num) + 1);
  } else {
    occurrencesMap.set(num, 1);
  }
  return occurrencesMap;
}, new Map());


const secondTask = (input) => {
  [left, right] = parse(input);

  const occurrencesMap = findOccurrences(right);
  return left.reduce((result, num) => {
    const numOfOccurrences = occurrencesMap.get(num) || 0;
    return result + (num * numOfOccurrences);
  }, 0);
};

console.log(firstTask(readFile("./src/01/input")));
console.log(secondTask(readFile("./src/01/input")));
