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

      button.forEachSide((move, sideButton) => {
        const newNrOfMoves = currentNrOfMoves + 1;
        try {
          if (newNrOfMoves <= nrOfMoves[sideButton.row][sideButton.col]) {
            nrOfMoves[sideButton.row][sideButton.col] = newNrOfMoves;
            pq.enqueue(
              [sideButton, newNrOfMoves, [...moves, move]],
              newNrOfMoves
            );
          }
        } catch {
          debugger;
        }
      });
    }

    return sequences;
  },
  (keypad, symbol, key) => [keypad.length, symbol, key.row, key.col].join("#")
);

const findAllSequences = (keypad, inputs, startKey) => {
  const allSeq = Array.from(
    new Set(
      inputs.flatMap((input) => findSequences(keypad, input, startKey))
    ).values()
  );
  const minSeqLength = allSeq.sort((a, b) => a.length - b.length).at(0).length;
  return allSeq.filter((seq) => seq.length === minSeqLength);
};

const findSequences = (keypad, input, startKey) => {
  const sequences = new Set();
  const symbols = input.split("");
  const queue = [[symbols, startKey, []]];

  while (queue.length > 0) {
    const [symbols, button, path] = queue.pop();
    if (symbols.length === 0) {
      sequences.add(path.join(""));
    }
    const [first, ...rest] = symbols;
    const results = moveToSymbol(keypad, first, button);
    results.forEach(([moves, key]) => {
      queue.push([rest, key, [...path, ...moves, "A"]]);
    });
  }

  const seqList = Array.from(sequences.values());
  const minSeqLength = seqList.sort((a, b) => a.length - b.length).at(0).length;

  return seqList.filter((seq) => seq.length === minSeqLength);
};

const firstTask = (input) => {
  return sum(
    input.split("\n").map((line) => {
      const first = findSequences(numericKeypad, line, numericKeypadStart);
      const second = findAllSequences(
        directionalKeypad,
        first,
        directionalKeypadStart
      );
      const third = findAllSequences(
        directionalKeypad,
        second.slice(0, 1),
        directionalKeypadStart
      ).at(0);

      console.log(third.length);
      return Number(line.match(/\d+/)[0]) * third.length;
    })
  );
};

const secondTask = (input) => 0;

console.log(firstTask(data));
// console.log(firstTask(readFile("./src/21/input")))
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/21/input")))

// v<<A^>>A<A>A<AA>vA^Av<AAA^>A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
