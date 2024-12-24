// https://adventofcode.com/2024/day/24
const { readFile } = require("../io");

const data = `
x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00
`.trim();

const parseWireEntry = (rawValue) => {
  const [wire, value] = rawValue.split(": ");
  return {
    [wire]: parseInt(value),
  };
};

const parseInstruction = (rawValue) => {
  const re = /(\w{3}) (AND|OR|XOR) (\w{3}) -> (\w{3})/;
  const [_, lWire, gate, rWire, outWire] = rawValue.match(re);
  return {
    lWire,
    gate,
    rWire,
    outWire,
  };
};

const parse = (input) => {
  const [wires, instructions] = input.split("\n\n");

  return {
    wires: wires
      .split("\n")
      .reduce((wires, wire) => ({ ...wires, ...parseWireEntry(wire) }), {}),
    instructions: instructions.split("\n").map(parseInstruction),
  };
};

const exec = {
  AND: (a, b) => a & b,
  OR: (a, b) => a || b,
  XOR: (a, b) => a ^ b,
};

const toNumber = (obj) =>
  parseInt(
    Object.entries(obj)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map((v) => v[1])
      .join(""),
    2
  );

const firstTask = (stringInput) => {
  const { wires, instructions } = parse(stringInput);
  const input = { ...wires };
  const output = {};

  while (instructions.length > 0) {
    const instruction = instructions.shift();
    const { lWire, rWire, gate, outWire } = instruction;

    const lInput = input[lWire];
    const rInput = input[rWire];

    if (lInput !== undefined && rInput !== undefined) {
      const reg = outWire.startsWith("z") ? output : input;
      reg[outWire] = exec[gate](lInput, rInput);
    } else {
      instructions.push(instruction);
    }
  }

  return toNumber(output);
};

const makeExpectedOutput = (wires) => {
  const { x, y } = Object.entries(wires).reduce(
    ({ x, y }, [wire, value]) => {
      if (wire.startsWith("x")) {
        x[wire] = value;
      } else {
        y[wire] = value;
      }
      return { x, y };
    },
    {
      x: {},
      y: {},
    }
  );

  const xValue = toNumber(x);
  const yValue = toNumber(y);
  const zValue = xValue + yValue;

  const expectedOutput = zValue
    .toString(2)
    .split("")
    .reduce((reg, bit, index) => {
      return { ...reg, [`z${index.toString().padStart(2, "0")}`]: +bit };
    }, {});

  return expectedOutput;
}

const secondTask = (stringInput) => {
  const { wires, instructions } = parse(stringInput);
  const output = makeExpectedOutput(wires);
};

console.log(firstTask(data));
console.log(firstTask(readFile("./src/24/input")));
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/24/input")))
