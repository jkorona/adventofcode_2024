class Button {
  static moves = [
    ["^", -1, 0],
    [">", 0, 1],
    ["v", 1, 0],
    ["<", 0, -1],
  ];

  constructor(keypad, symbol, row, col) {
    this.keypad = keypad;
    this.symbol = symbol;
    this.row = row;
    this.col = col;
  }

  forEachSide(prev, fn) {
    const start = Button.moves.findIndex(([move]) => move === prev);
    for (let index = start; index < start + 4; index++) {
      const [move, dy, dx] = Button.moves[index % 4];
      const buttonOnSide = this.keypad[this.row + dy]?.[this.col + dx];
      if (buttonOnSide) {
        fn(move, buttonOnSide);
      }
    }
  }
}

module.exports.isBackMove = (prev, curr) => {
  const prevIndex = Button.moves.findIndex(([move]) => move === prev);
  const currIndex = Button.moves.findIndex(([move]) => move === curr);

  return Math.abs(currIndex - 2) === prevIndex;
};

const numericKeypad = [];
[
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
].forEach((line, row) => {
  numericKeypad.push(
    line.map(
      (symbol, col) => symbol && new Button(numericKeypad, symbol, row, col)
    )
  );
});

const directionalKeypad = [];
[
  [null, "^", "A"],
  ["<", "v", ">"],
].forEach((line, row) => {
  directionalKeypad.push(
    line.map(
      (symbol, col) => symbol && new Button(directionalKeypad, symbol, row, col)
    )
  );
});

module.exports.numericKeypad = numericKeypad;
module.exports.directionalKeypad = directionalKeypad;
module.exports.numericKeypadStart = numericKeypad[3][2];
module.exports.directionalKeypadStart = directionalKeypad[0][2];
