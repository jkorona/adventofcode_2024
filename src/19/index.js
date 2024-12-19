// https://adventofcode.com/2024/day/19
const { readFile } = require("../io");
const { memoize, sum } = require("../utils");

const parse = (input) => {
  const [patterns, designs] = input.split("\n\n");
  return {
    patterns: patterns.split(", "),
    designs: designs.split("\n"),
  };
};

const isPossible = memoize(
  (patterns, design) => {
    if (design.length === 0) {
      return true;
    }

    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        if (isPossible(patterns, design.substr(pattern.length))) {
          return true;
        }
      }
    }

    return false;
  },
  (_, design) => design
);

const countCombinations = memoize(
  (patterns, design) => {
    if (design.length === 0) {
      return 1;
    }

    let matches = 0;
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      if (design.startsWith(pattern)) {
        matches += countCombinations(patterns, design.substr(pattern.length));
      }
    }

    return matches;
  },
  (_, design) => design
);

const firstTask = (input) => {
  const { patterns, designs } = parse(input);

  return designs.filter((design) => isPossible(patterns, design)).length;
};

const secondTask = (input) => {
  const { patterns, designs } = parse(input);
  const result = designs.map(
    (design) => countCombinations(patterns, design, [])
  );
  return sum(result);
};

console.log(firstTask(readFile("./src/19/input")));
console.log(secondTask(readFile("./src/19/input")));
