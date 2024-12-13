// https://adventofcode.com/2024/day/13
const { readFile } = require("../io");

const parse = (input, correction = 0) =>
  input.split("\n\n").map((machine) => {
    const [buttonA, buttonB, prize] = machine.split("\n");
    const [, ax, ay] = buttonA.match(/X\+(\d+), Y\+(\d+)/);
    const [, bx, by] = buttonB.match(/X\+(\d+), Y\+(\d+)/);
    const [, x, y] = prize.match(/X=(\d+), Y=(\d+)/);

    return {
      buttonA: [ax, ay].map((v) => parseInt(v)),
      buttonB: [bx, by].map((v) => parseInt(v)),
      prize: [x, y].map((v) => parseInt(v) + correction),
    };
  });

const memoize = (fn) => {
  const cache = {};
  return (buttonA, buttonB, prize) => {
    const key = [...buttonA, ...buttonB, ...prize].join("|");
    if (typeof cache[key] !== "undefined") {
      return cache[key];
    }
    const result = fn(buttonA, buttonB, prize);
    cache[key] = result;
    return result;
  };
};

const minTokens = memoize((buttonA, buttonB, prize) => {
  const [goalX, goalY] = prize;
  if (goalX === 0 && goalY === 0) {
    return 0;
  } else if (goalX < 0 || goalY < 0) {
    return NaN;
  } else {
    const onButtonA =
      3 + minTokens(buttonA, buttonB, [goalX - buttonA[0], goalY - buttonA[1]]);
    const onButtonB =
      1 + minTokens(buttonA, buttonB, [goalX - buttonB[0], goalY - buttonB[1]]);

    if (isNaN(onButtonA) || isNaN(onButtonB)) {
      return onButtonA || onButtonB;
    }
    return Math.min(onButtonA, onButtonB);
  }
});

const bruteForce = (input) => {
  const machines = parse(input);

  return machines
    .map(({ buttonA, buttonB, prize }) => minTokens(buttonA, buttonB, prize))
    .filter((tokens) => !isNaN(tokens))
    .reduce((sum, tokens) => sum + tokens, 0);
};

const cramersRule = (a, b, e, c, d, f) => {
  const x = (e * d - b * f) / (a * d - b * c);
  const y = (a * f - e * c) / (a * d - b * c);
  return [x, y];
};

const mathBased = (input, correction) => {
  const machines = parse(input, correction);
  return machines
    .map(({ buttonA, buttonB, prize }) =>
      cramersRule(
        buttonA[0],
        buttonB[0],
        prize[0],
        buttonA[1],
        buttonB[1],
        prize[1]
      )
    )
    .filter(([a, b]) => Number.isInteger(a) && Number.isInteger(b))
    .reduce((sum, [a, b]) => sum + 3 * a + b, 0);
};

console.log(bruteForce(readFile("./src/13/input")));
console.log(mathBased(readFile("./src/13/input")));
console.log(mathBased(readFile("./src/13/input"), 10000000000000));
