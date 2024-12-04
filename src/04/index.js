const readFile = require("../io");

const data = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`.trim();

const parse = (input) => {
  return input
    .split("\n")
    .map((line) => line.split("").map((value) => ({ value })));
};

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const iterator = (matrix, init = [0, 0]) => {
  let [x, y] = init;
  return {
    next() {
      const [newX, newY] = x + 1 >= matrix[y].length ? [0, y + 1] : [x + 1, y];
      return newY < matrix.length ? iterator(matrix, [newX, newY]) : null;
    },
    current() {
      return matrix[y][x];
    },
    move(dx, dy) {
      const [newX, newY] = [x + dx, y + dy];
      if (matrix[newY]?.[newX] === undefined) {
        return null;
      }
      return iterator(matrix, [newX, newY]);
    },
  };
};

const countMatches = (it) => {
  if (it.current().value === "X") {
    const matches = directions.filter(([dx, dy]) => {
      let next = it;
      return ["M", "A", "S"].every((letter) => {
        next = next.move(dx, dy);
        return next?.current().value === letter;
      });
    });
    return matches.length;
  }
  return 0;
};

const firstTask = (input) => {
  const matrix = parse(input);
  let numOfWords = 0;
  let it = iterator(matrix, [-1, 0]);
  while ((it = it.next())) {
    numOfWords += countMatches(it);
  }
  return numOfWords;
};

console.log(firstTask(readFile("./src/04/input")));
