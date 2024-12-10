const { readFile } = require("../io");
const { repeat } = require("../utils");

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
        taken.push({ index, id: cell });
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
  taken.forEach(({ id, index }) => (memory[index] = id));
  return memory;
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
    const { id, index } = taken.pop();

    taken.unshift({ id, index: freeIndex });
    free.push(index);
  }

  return checksum(rebuildMemory(taken, memory.length));
};

const parseToBlocks = (input) => {
  return input.split("").reduce(
    ({ blocks: { free, taken }, id, cursor }, segment, index) => {
      const size = parseInt(segment, 10);
      if (index % 2 === 0) {
        taken.push({ index: cursor, id, size });
        id++;
      } else {
        free.push({ index: cursor, size });
      }

      return { blocks: { free, taken }, id, cursor: cursor + size };
    },
    {
      blocks: { free: [], taken: [] },
      id: 0,
      cursor: 0,
    }
  );
};

const secondTask = (input) => {
  const {
    blocks: { free, taken },
    cursor: length,
  } = parseToBlocks(input);
  const newOrder = [];

  while (taken.length > 0) {
    const file = taken.pop();
    if (file.size <= 0) continue;
    const slot = free.find(
      ({ size, index }) => size >= file.size && index < file.index
    );

    if (slot) {
      newOrder.push({ ...file, index: slot.index });
      const remaining = slot.size - file.size;
      slot.size = remaining;
      slot.index = slot.index + file.size;
    } else {
      newOrder.push(file);
    }
  }

  const memory = newOrder.reduce((memory, file) => {
    for (let index = file.index; index < file.index + file.size; index++) {
      memory[index] = file.id;
    }
    return memory;
  }, repeat(-1, length));

  return checksum(memory);
};

console.log(firstTask(readFile('./src/09/input')));
console.log(secondTask(readFile('./src/09/input')));
