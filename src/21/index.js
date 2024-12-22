// https://adventofcode.com/2024/day/21
const { PriorityQueue } = require("../collections");
const { readFile } = require("../io");
const { memoize, sum } = require("../utils");
const { numericKeypad, directionalKeypad } = require("./keypads");

const moveToSymbol = (keypad, symbol, key) => {
  const sequences = [];
  const pq = new PriorityQueue();

  const nrOfMoves = Array.from({ length: keypad.length }, () =>
    Array.from({ length: keypad[0].length }, () => Infinity)
  );

  pq.enqueue([key, 0, []], 0);

  while (!pq.isEmpty()) {
    const [button, currentNrOfMoves, moves] = pq.dequeue();

    if (button.symbol === symbol) {
      sequences.push([...moves, "A"]);
    }

    button.forEachSide(moves.at(-1) ?? "v", (move, sideButton) => {
      const newNrOfMoves = currentNrOfMoves + 1;
      if (newNrOfMoves <= nrOfMoves[sideButton.row][sideButton.col]) {
        nrOfMoves[sideButton.row][sideButton.col] = newNrOfMoves;
        pq.enqueue([sideButton, newNrOfMoves, [...moves, move]], newNrOfMoves);
      }
    });
  }

  return sequences.sort((a, b) => a.length - b.length);
};

const getKeyPresses = memoize(
  (keypad, code, robot) => {
    let current = keypad.start;
    let length = 0;
    for (let i = 0; i < code.length; i++) {
      const moves = moveToSymbol(keypad, code[i], current);
      if (robot === 0) length += moves.at(0).length;
      else
        length += Math.min(
          ...moves.map((move) =>
            getKeyPresses(directionalKeypad, move, robot - 1)
          )
        );
      current = keypad.get(code[i]);
    }
    return length;
  },
  (_, code, robot) => `${code},${robot}`
);

const solution = (input, nrOfRobots) => {
  return sum(
    input.split("\n").map((line) => {
      const keyPresses = getKeyPresses(numericKeypad, line, nrOfRobots);
      return Number(line.match(/\d+/)[0]) * keyPresses;
    })
  );
};

const firstTask = (input) => solution(input, 2);
const secondTask = (input) => solution(input, 25);

console.log(firstTask(readFile("./src/21/input")));
console.log(secondTask(readFile("./src/21/input")));
