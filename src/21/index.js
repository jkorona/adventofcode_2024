// https://adventofcode.com/2024/day/21
const { PriorityQueue } = require("../collections");
const { readFile } = require("../io");
const { memoize, sum } = require("../utils");
const {
  numericKeypad,
  directionalKeypad,
  numericKeypadStart,
  directionalKeypadStart,
} = require("./keypads");

const data = `
029A
980A
179A
456A
379A
`.trim();

const moveToSymbol = memoize(
  (keypad, symbol, key) => {
    const sequences = [];
    const pq = new PriorityQueue();

    const nrOfMoves = Array.from({ length: keypad.length }, () =>
      Array.from({ length: keypad[0].length }, () => Infinity)
    );

    pq.enqueue([key, 0, []], 0);

    while (!pq.isEmpty()) {
      const [button, currentNrOfMoves, moves] = pq.dequeue();

      if (button.symbol === symbol) {
        sequences.push([moves, button]);
      }

      button.forEachSide(moves.at(-1) ?? "v", (move, sideButton) => {
        const newNrOfMoves = currentNrOfMoves + 1;
        if (newNrOfMoves <= nrOfMoves[sideButton.row][sideButton.col]) {
          nrOfMoves[sideButton.row][sideButton.col] = newNrOfMoves;
          pq.enqueue(
            [sideButton, newNrOfMoves, [...moves, move]],
            newNrOfMoves
          );
        }
      });
    }

    return sequences;
  },
  (keypad, symbol, key) => [keypad.length, symbol, key.row, key.col].join("#")
);

const findSequences = (keypad, input, startKey) => {
  const sequences = [];
  const symbols = input.split("");
  const queue = [[symbols, startKey, []]];

  while (queue.length > 0) {
    const [symbols, button, path] = queue.pop();
    if (symbols.length === 0) {
      sequences.push(path.join(""));
    }
    const [first, ...rest] = symbols;
    const results = moveToSymbol(keypad, first, button);
    results.forEach(([moves, key]) => {
      queue.push([rest, key, [...path, ...moves, "A"]]);
    });
  }

  return sequences;
};

const findBestSequence = (keypad, input, startKey) => {
  const symbols = input.split("");
  const queue = [[symbols, startKey, []]];

  while (queue.length > 0) {
    const [symbols, button, path] = queue.pop();
    if (symbols.length === 0) {
      return path.join("");
    }
    const [first, ...rest] = symbols;
    const [moves, key] = moveToSymbol(keypad, first, button).at(0);
    queue.push([rest, key, [...path, ...moves, "A"]]);
  }

  return "";
};

const solution = (input, nrOfRobots) => {
  return sum(
    input.split("\n").map((line) => {
      const instructions = findSequences(
        numericKeypad,
        line,
        numericKeypadStart
      )
        .map((seq) => {
          let factor = 0;
          seq.split("").reduce((prev, next) => {
            if (prev === next) {
              factor += 1;
            }
            return next;
          });
          return [seq, factor];
        })
        .sort((a, b) => b[1] - a[1])
        .filter(([, factor], _, arr) => {
          return factor === arr[0][1];
        })
        .map(([seq]) => seq);

      const paths = instructions.map((initialInstruction) => {
        let instruction = initialInstruction;
        for (let robot = 0; robot < nrOfRobots; robot++) {          
          instruction = findBestSequence(
            directionalKeypad,
            instruction,
            directionalKeypadStart
          );
          console.log(line, ":", "robot", robot + 1);
        }
        return instruction;
      });
      const final = paths.sort((a, b) => a.length - b.length).at(0);
      return Number(line.match(/\d+/)[0]) * final.length;
    })
  );
};

const firstTask = (input) => solution(input, 2);
const secondTask = (input) => solution(input, 25);

// console.log(firstTask(data));
console.log(firstTask(readFile("./src/21/input")));
// console.log(secondTask(data));
console.log(secondTask(readFile("./src/21/input")))
