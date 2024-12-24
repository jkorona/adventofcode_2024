// https://adventofcode.com/2024/day/24
const { readFile } = require("../io");

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
};

let opCount = 0;
const visualize = ({ lWire, rWire, gate, outWire }) => {
  const opId = opCount++;

  console.log(lWire, "-->", opId + `{${gate}}`);
  console.log(rWire, "-->", opId);
  console.log(opId, "-->", outWire);
};

const secondTask = (stringInput) => {
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
      visualize(instruction);
    } else {
      instructions.push(instruction);
    }
  }
};

console.log(firstTask(readFile("./src/24/fixed_input")));
console.log(secondTask(readFile("./src/24/input")))
