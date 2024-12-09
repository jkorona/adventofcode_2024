const readFile = require("../io");
const { repeat } = require("../utils");

const data = `2333133121414131402`;

const parse = (input) => {
  const { memory } = input.split("").reduce(
    ({ memory, id }, value, index) => {
      const numericValue = parseInt(value, 10);

      if (index % 2 === 0) {
        memory = memory.concat(repeat(id++, numericValue));
      } else {
        memory = memory.concat(repeat(-1, numericValue));
      }
      return { memory, id };
    },
    { memory: [], id: 0 }
  );

  return memory;
};

const getIndices = (memory) =>
  memory.reduce(
    ({ free, taken }, cell, index) => {
      if (cell < 0) {
        free.push(index);
      } else {
        taken.push({ index, value: cell });
      }
      return { free, taken };
    },
    {
      free: [],
      taken: [],
    }
  );

const rebuildMemory = (taken, size) => {
  const memory = repeat(-1, size);
  taken.forEach(({ value, index }) => (memory[index] = value));
  return memory
};

const checksum = (memory) =>
  memory.reduce((checksum, value, index) => {
    if (value > -1) {
      return index * value + checksum;
    }
    return checksum;
  }, 0);

const firstTask = (input) => {
  const memory = parse(input);
  const { free, taken } = getIndices(memory);
  while (free.at(0) < taken.at(-1).index) {
    const freeIndex = free.shift();
    const { value, index } = taken.pop();

    taken.unshift({ value, index: freeIndex });
    free.push(index);
  }

  return checksum(rebuildMemory(taken, memory.length));
};

console.log(firstTask(readFile('./src/09/input')));
