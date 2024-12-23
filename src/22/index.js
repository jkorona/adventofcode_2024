// https://adventofcode.com/2024/day/22
const { readFile } = require("../io");
const { sum } = require("../utils");


const parse = (input) => input.split("\n").map(Number);

const mix = (secret, given) => (secret ^ given) >>> 0;
const prune = (secret) => secret % 16777216;

const generateSecret = (prev) => {
  const a = prune(mix(prev, prev * 64));
  const b = prune(mix(a, Math.floor(a / 32)));
  const c = prune(mix(b, b * 2048));
  return c;
};

const price = (secret) => parseInt(secret.toString().split("").at(-1));
const repeat = (secret, times) => {
  const results = [];

  let current = secret;
  let prevPrice = price(current);

  for (let i = 0; i < times; i++) {
    current = generateSecret(current);
    const currentPrice = price(current);
    results.push({
      secret: current,
      price: currentPrice,
      diff: currentPrice - prevPrice,
    });
    prevPrice = currentPrice;
  }

  return results;
};

const groupChanges = (secrets) => {
  const changes = {};
  for (let i = 0; i <= secrets.length - 4; i++) {
    const a = secrets[i];
    const b = secrets[i + 1];
    const c = secrets[i + 2];
    const d = secrets[i + 3];
    const sequence = `${a.diff},${b.diff},${c.diff},${d.diff}`;
    if (!changes[sequence]) {
      changes[sequence] = { price: d.price };
    }
  }
  return changes;
};

const firstTask = (input) =>
  sum(parse(input).map((secret) => repeat(secret, 2000).at(-1).secret));

const secondTask = (input) => {
  const allSecrets = parse(input).map((secret) => repeat(secret, 2000));
  const changes = allSecrets.map(groupChanges);

  const queues = changes.map(Object.entries);
  const checked = {};
  let max = [0, ""];
  while (queues.some((queue) => queue.length > 0)) {
    const sequences = queues.map((queue) => queue.pop()).filter(Boolean);
    sequences.map(([sequence]) => {
      if (!checked[sequence]) {
        const banans = sum(
          changes.map((merchant) => {
            if (merchant[sequence]) {
              return merchant[sequence].price;
            }
            return 0;
          })
        );
        if (banans > max[0]) {
          max = [banans, sequence];
        }
        checked[sequence] = true;
      }
    });
  }

  return max;
};

console.log(firstTask(readFile("./src/22/input")));
console.log(secondTask(readFile("./src/22/input")));
