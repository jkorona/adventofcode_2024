// https://adventofcode.com/2024/day/17

const input = `
Register A: 65804993
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,1,4,0,3,4,5,5,5,3,0
`.trim();

const init = (input) => {
  const [registers, program] = input.split("\n\n");
  const [A, B, C] = registers.match(/(\d+)/g).map((n) => parseInt(n));
  const cpu = {
    A,
    B,
    C,
    pointer: 0,
    output: [],
    program: program
      .substr(9)
      .split(",")
      .map((n) => parseInt(n)),
  };
  return cpu;
};

const getCombo = (operand, cpu) => [0, 1, 2, 3, cpu.A, cpu.B, cpu.C][operand];

const adv = (operand, cpu) => {
  const combo = getCombo(operand, cpu);
  const numerator = cpu.A;
  const denominator = Math.pow(2, combo);

  cpu.A = Math.floor(numerator / denominator);
};

const bxl = (operand, cpu) => {
  const bValue = cpu.B;
  cpu.B = (bValue ^ operand) >>> 0;
};

const bst = (operand, cpu) => {
  const combo = getCombo(operand, cpu);
  cpu.B = combo % 8;
};

const jnz = (operand, cpu) => {
  const aValue = cpu.A;
  if (aValue !== 0) {
    cpu.pointer = operand;
    return true;
  }
};

const bxc = (_, cpu) => {
  cpu.B = (cpu.B ^ cpu.C) >>> 0;
};

const out = (operand, cpu) => {
  const combo = getCombo(operand, cpu);
  cpu.output.push(combo % 8);
};

const bdv = (operand, cpu) => {
  const combo = getCombo(operand, cpu);
  const numerator = cpu.A;
  const denominator = Math.pow(2, combo);

  cpu.B = Math.floor(numerator / denominator);
};

const cdv = (operand, cpu) => {
  const combo = getCombo(operand, cpu);
  const numerator = cpu.A;
  const denominator = Math.pow(2, combo);

  cpu.C = Math.floor(numerator / denominator);
};

const opcodes = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const exec = (cpu) => {
  while (cpu.pointer < cpu.program.length) {
    const opcode = cpu.program[cpu.pointer];
    const operand = cpu.program[cpu.pointer + 1];

    const instruction = opcodes[opcode];

    if (!instruction(operand, cpu)) {
      cpu.pointer += 2;
    }
  }

  return cpu;
};

const firstTask = (input) => {
  const cpu = init(input);
  return exec(cpu).output.join(",");
};

const getCtx = (program, aValue) => ({
  program,
  A: aValue,
  B: 0,
  C: 0,
  pointer: 0,
  output: [],
});

const find = (program, target, aValue = 0) => {
  if (target.length === 0) {
    return aValue;
  }
  const candidates = Array.from({ length: 8 }, (_, index) => index).map(
    (candidate) => candidate + aValue * 8
  );

  for (const candidate of candidates) {
    const execution = exec(getCtx(program, candidate));
    if (execution.output.at(-1) === target.at(-1)) {
      try {
        return find(program, target.slice(0, -1), candidate);
      } catch {
        // just continue
      }
    }
  }

  throw new Error("Stop");
};

const secondTask = (input) => {
  const { program } = init(input);
  const loop = program.slice(0, program.length - 2);
  return find(loop, program);
};

console.log(firstTask(input));
console.log(secondTask(input));
