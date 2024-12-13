// https://adventofcode.com/2024/day/13
const { readFile } = require("../io");

const data = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`.trim();

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

const firstTask = (input, correction) => {
  const machines = parse(input, correction);

  return machines
    .map(({ buttonA, buttonB, prize }) => minTokens(buttonA, buttonB, prize))
    .filter((tokens) => !isNaN(tokens))
    .reduce((sum, tokens) => sum + tokens, 0);
};


// console.log(firstTask(readFile('./src/13/input')));
console.log(firstTask(data, 10000000000000));
