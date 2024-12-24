// https://adventofcode.com/2024/day/24
const { readFile } = require("../io");

const data = `
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
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

  const outputNumber = Object.entries(output)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map((v) => v[1])
    .join("");
  return parseInt(outputNumber, 2);
};

const secondTask = (input) => 0;

// console.log(firstTask(data));
console.log(firstTask(readFile("./src/24/input")))
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/24/input")))
