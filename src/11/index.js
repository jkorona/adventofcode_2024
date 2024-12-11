const data = `6563348 67 395 0 6 4425 89567 739318`;

const createCache = (size) => {
  const storage = {};
  return {
    add(stone, iter, value) {
      const table = storage[stone] ?? Array.from({ length: size }, (_) => _);
      table[iter] = value;
      storage[stone] = table;
    },
    has(stone, iter) {
      return storage?.[stone]?.[iter] !== undefined;
    },
    get(stone, iter) {
      return storage[stone][iter];
    },
  };
};

const recursiveCheck = (stone, iter, limit, cache) => {
  if (iter === limit) {
    return 1;
  }
  if (cache.has(stone, iter)) {
    return cache.get(stone, iter);
  }
  let result;
  if (stone === "0") {
    result = recursiveCheck("1", iter + 1, limit, cache);
  } else if (stone.length % 2 === 0) {
    const [s1, s2] = [
      parseInt(stone.substr(0, stone.length / 2)),
      parseInt(stone.substr(stone.length / 2)),
    ];
    result =
      recursiveCheck(`${s1}`, iter + 1, limit, cache) +
      recursiveCheck(`${s2}`, iter + 1, limit, cache);
  } else {
    result = recursiveCheck(
      `${parseInt(stone) * 2024}`,
      iter + 1,
      limit,
      cache
    );
  }
  cache.add(stone, iter, result);
  return result;
};

const firstTask = (input) => {
  const BLINKS = 25;
  const stones = input.split(" ");
  const cache = createCache(BLINKS);

  return stones.reduce(
    (sum, stone) => sum + recursiveCheck(stone, 0, BLINKS, cache),
    0
  );
};

const secondTask = (input) => {
  const BLINKS = 75;
  const stones = input.split(" ");
  const cache = createCache(BLINKS);

  return stones.reduce(
    (sum, stone) => sum + recursiveCheck(stone, 0, BLINKS, cache),
    0
  );
};

console.log(firstTask(data));
console.log(secondTask(data));
