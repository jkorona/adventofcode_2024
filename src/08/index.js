const { readFile } = require("../io");
const { withinMatrix } = require("../utils");

const parse = (input) => {
  const lines = input.split("\n");
  const antennasPerFreq = lines.reduce((frequencies, line, y) => {
    const antennas = line
      .split("")
      .map((point, x) => ({ frequency: point, coords: [x, y] }))
      .filter(({ frequency }) => /[A-Z|a-z|0-9]/.test(frequency));

    antennas.forEach(({ frequency, coords }) => {
      if (!frequencies.hasOwnProperty(frequency)) {
        frequencies[frequency] = [];
      }
      frequencies[frequency].push(coords);
    });
    return frequencies;
  }, {});
  return {
    antennasPerFreq,
    mapSize: { rows: lines.length, cols: lines.at(0).length },
  };
};

const addSingle = (antenna, dir, mapSize) => {
  const antinode = [antenna[0] + dir[0], antenna[1] + dir[1]];
  if (withinMatrix(antinode, mapSize.cols, mapSize.rows)) {
    return [`${antinode}`];
  }
  return [];
};

const addMany = (antenna, dir, mapSize) => {
  const results = [];
  let antinode = antenna;
  while (withinMatrix(antinode, mapSize.cols, mapSize.rows)) {
    results.push(`${antinode}`);
    current = antinode;
    antinode = [current[0] + dir[0], current[1] + dir[1]];
  }
  return results;
};

const getAntinodes = (antennas, mapSize, findAntinodes) => {
  const antinodes = [];
  for (let a = 0; a < antennas.length; a++) {
    const antenna = antennas[a];
    for (let n = 0; n < antennas.length; n++) {
      if (n !== a) {
        const dir = [antenna[0] - antennas[n][0], antenna[1] - antennas[n][1]];
        antinodes.push(...findAntinodes(antenna, dir, mapSize));
      }
    }
  }
  return antinodes;
};

const firstTask = (input) => {
  const { antennasPerFreq, mapSize } = parse(input);

  return Object.entries(antennasPerFreq).reduce((antinodes, [, antennas]) => {
    return new Set([
      ...antinodes,
      ...getAntinodes(antennas, mapSize, addSingle),
    ]);
  }, new Set()).size;
};

const secondTask = (input) => {
  const { antennasPerFreq, mapSize } = parse(input);

  const antinodes = Object.entries(antennasPerFreq).reduce(
    (antinodes, [, antennas]) => {
      return new Set([
        ...antinodes,
        ...getAntinodes(antennas, mapSize, addMany),
      ]);
    },
    new Set()
  );

  return antinodes.size;
};

console.log(firstTask(readFile("./src/08/input")));
console.log(secondTask(readFile("./src/08/input")));
