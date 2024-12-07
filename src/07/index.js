const readFile = require("../io");
const { sum } = require("../utils");

const parse = (input) =>
  input.split("\n").map((line) => {
    const [value, components] = line.split(": ");
    return {
      value: parseInt(value, 10),
      components: components.split(" "),
    };
  });

const calc = (expression) => {
  let queue = [...expression];
  while (queue.length > 1) {
    const [left, operator, right, ...rest] = queue;
    if (operator === "||") {
    }
    const partial =
      operator === "||"
        ? `${left}${right}`
        : eval(`${left}${operator}${right}`);
    queue = [partial, ...rest];
  }
  return parseInt(queue.at(0), 10);
};

const addAllResults = (results, components, operators) => {
  const helper = (expression, remaining) => {
    if (remaining.length === 0) {
      results.add(calc(expression));
      return;
    }

    const nextNumber = remaining[0];
    const rest = remaining.slice(1);

    operators.forEach((operator) =>
      helper([...expression, operator, nextNumber], rest)
    );
  };

  helper([components[0]], components.slice(1));
};

const hasSolution = (value, components, operators) => {
  const results = new Set();
  addAllResults(results, components, operators);
  return results.has(value);
};

const firstTask = (input) => {
  const data = parse(input);
  const valid = data.filter(({ value, components }) =>
    hasSolution(value, components, ["+", "*"])
  );
  return sum(valid.map(({ value }) => value));
};

const secondTask = (input) => {
  const data = parse(input);
  const valid = data.filter(({ value, components }) =>
    hasSolution(value, components, ["+", "*", "||"])
  );
  return sum(valid.map(({ value }) => value));
};

console.log(firstTask(readFile("./src/07/input")));
console.log(secondTask(readFile("./src/07/input")));
