const { readFile } = require("../io");
const { reverse } = require("../string");

const parse = (input) => {
  return input
    .split("\n")
    .map((line) => line.split("").map((value) => ({ value })));
};

const deltas = [
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

const countXMAS = (it) => {
  if (it.current().value === "X") {
    const matches = deltas.filter(([dx, dy]) => {
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
    numOfWords += countXMAS(it);
  }
  return numOfWords;
};

const diagonals = {
  fwd: [
    [-1, 1],
    [0, 0],
    [1, -1],
  ],
  bck: [
    [-1, -1],
    [0, 0],
    [1, 1],
  ],
};

const join = (it, deltas) =>
  deltas.reduce((word, [dx, dy]) => {
    return word + it.move(dx, dy)?.current().value ?? "";
  }, "");

const isMAS = (word) => word === "MAS" || reverse(word) === "MAS";

const matchesX_MAS = (it) => {
  if (it.current().value === "A") {
    return isMAS(join(it, diagonals.fwd)) && isMAS(join(it, diagonals.bck));
  }
  return false;
};

const secondTask = (input) => {
  const matrix = parse(input);
  let numOfWords = 0;
  let it = iterator(matrix, [-1, 0]);
  while ((it = it.next())) {
    if (matchesX_MAS(it)) {
      numOfWords++;
    }
  }
  return numOfWords;
};

console.log(firstTask(readFile("./src/04/input")));
console.log(secondTask(readFile("./src/04/input")));
