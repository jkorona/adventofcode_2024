const readFile = require("../io");

const parse = (input) => {
  const [first, second] = input.split("\n\n");

  const rules = first.split("\n").reduce((map, line) => {
    const [prev, next] = line.split("|").map((value) => parseInt(value, 10));
    const values = map.get(prev) ?? [];
    map.set(prev, [next, ...values]);
    return map;
  }, new Map());

  const updates = second.split("\n").reduce((updates, line) => {
    const list = line.split(",").map((value) => parseInt(value, 10));
    const dict = list.reduce((dict, num, index) => {
      dict.set(num, index);
      return dict;
    }, new Map());
    return [...updates, { list, dict }];
  }, []);

  return { rules, updates };
};

const areUpdatesCorrect = ({ list, dict }, rules) =>
  list.every((num, index) => {
    const successors = rules.get(num);
    return (
      successors?.every(
        (successor) => !dict.has(successor) || dict.get(successor) > index
      ) ?? true
    );
  });

const sumMiddleNumbers = (updates) =>
  updates.reduce((sum, { list }) => sum + list[Math.floor(list.length / 2)], 0);

const firstTask = (input) => {
  const { rules, updates } = parse(input);
  const correct = updates.filter((updates) =>
    areUpdatesCorrect(updates, rules)
  );
  return sumMiddleNumbers(correct);
};

const dictToList = (dict) =>
  [...dict.entries()].reduce((result, [num, index]) => {
    result[index] = num;
    return result;
  }, new Array(dict.size));

const fix = ({ list, dict }, rules, startIndex) => {
  if (startIndex >= list.length) {
    return { list, dict };
  }

  let num = list[startIndex];
  const successors = rules.get(num);
  successors?.forEach((successor) => {
    const currentIndex = dict.get(num);
    const successorIndex = dict.get(successor);
    if (successorIndex !== undefined && successorIndex < currentIndex) {
      dict.set(num, successorIndex);
      dict.set(successor, currentIndex);
    }
  });

  return fix({ list: dictToList(dict), dict }, rules, dict.get(num) + 1);
};

const secondTask = (input) => {
  const { rules, updates } = parse(input);
  const fixed = updates
    .filter((updates) => !areUpdatesCorrect(updates, rules))
    .map((updates) => fix(updates, rules, 0));

  return sumMiddleNumbers(fixed);
};

console.log(firstTask(readFile("./src/05/input")));
console.log(secondTask(readFile("./src/05/input")));
