// https://adventofcode.com/2024/day/19
const { readFile } = require("../io");
const { memoize } = require("../utils");

const data = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`.trim();

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

const firstTask = (input) => {
  const { patterns, designs } = parse(input);

  return designs.filter((design) => isPossible(patterns, design)).length;
};

const secondTask = (input) => 0;

// console.log(firstTask(data));
console.log(firstTask(readFile("./src/19/input")));
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/19/input")))
