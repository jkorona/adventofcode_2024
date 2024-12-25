// https://adventofcode.com/2024/day/25
const { readFile } = require("../io");

const parseHeights = (input) =>
  input.split("\n\n").reduce(
    ({ locks, keys }, pattern) => {
      const rows = pattern.split("\n");
      const [firstRow] = rows;

      const heights = Array(firstRow.length).fill(0);
      for (let rowIndex = 1; rowIndex < rows.length - 1; rowIndex++) {
        const row = rows[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const pin = row[colIndex];
          heights[colIndex] += pin === "#" ? 1 : 0;
        }
      }

      if (firstRow.split("").every((pin) => pin === "#")) {
        // is lock
        locks.push(heights);
      } else {
        // is key
        keys.push(heights);
      }
      return { locks, keys };
    },
    { locks: [], keys: [] }
  );

const firstTask = (input) => {
  const { locks, keys } = parseHeights(input);

  return locks.reduce((fitting, lock) => {
    let matches = keys.filter((key) => {
      return key.every((pin, index) => pin + lock[index] < 6);
    }).length;
    return fitting + matches;
  }, 0);
};

console.log(firstTask(readFile("./src/25/input")));
