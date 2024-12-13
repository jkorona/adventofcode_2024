// https://adventofcode.com/2024/day/12

const { readFile } = require("../io");
const { sum } = require("../utils");

class Plot {
  #map;

  constructor(map, plant, row, column) {
    this.#map = map;
    this.plant = plant;
    this.row = row;
    this.column = column;
    this.visited = false;
  }

  get perimeter() {
    let perimeter = 4;
    this.forEachNeighbour((plot) =>
      plot.plant === this.plant ? --perimeter : perimeter
    );
    return perimeter;
  }

  forEachNeighbour(fn) {
    this.forEachSide((side) => side.plant && fn(side));
  }

  getPlot(deltaX, deltaY) {
    const [row, column] = [this.row + deltaY, this.column + deltaX];
    return this.#map[row]?.[column] ?? { column, row };
  }

  forEachSide(fn) {
    [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ].forEach(([dy, dx]) => fn(this.getPlot(dx, dy)));
  }
}

const buildRegion = (plot, region) => {
  plot.visited = true;
  region = {
    area: region.area + 1,
    perimeter: region.perimeter + plot.perimeter,
    plots: [...region.plots, plot],
  };

  plot.forEachNeighbour((neighbour) => {
    if (!neighbour.visited && neighbour.plant === plot.plant) {
      region = buildRegion(neighbour, region);
    }
  });

  return region;
};

const parse = (input) =>
  input.split("\n").reduce((map, line, row) => {
    map.push(
      line.split("").map((plant, col) => new Plot(map, plant, row, col))
    );
    return map;
  }, []);

const findAllRegions = (input) => {
  const map = parse(input);
  const regions = [];

  for (let row = 0; row < map.length; row++) {
    const mapRow = map[row];
    for (let col = 0; col < mapRow.length; col++) {
      const plot = mapRow[col];
      if (!plot.visited) {
        regions.push(buildRegion(plot, { area: 0, perimeter: 0, plots: [] }));
      }
    }
  }
  return regions;
};

const firstTask = (input) => {
  return findAllRegions(input).reduce(
    (sum, { area, perimeter }) => sum + area * perimeter,
    0
  );
};

const outsideCorners = [
  [
    [0, -1],
    [1, 0],
  ],
  [
    [0, -1],
    [-1, 0],
  ],
  [
    [0, 1],
    [-1, 0],
  ],
  [
    [1, 0],
    [0, 1],
  ],
];

const insideCorners = [
  [
    [1, 0],
    [1, 1],
    [0, 1],
  ],
  [
    [0, -1],
    [1, -1],
    [1, 0],
  ],
  [
    [0, -1],
    [-1, -1],
    [-1, 0],
  ],
  [
    [-1, 0],
    [-1, 1],
    [0, 1],
  ],
];

const calcSides = (region) => {
  let result = 0;
  for (const plot of region.plots) {
    outsideCorners.forEach((ns) => {
      if (ns.every(([dx, dy]) => plot.getPlot(dx, dy).plant !== plot.plant)) {
        result++;
      }
    });
    insideCorners.forEach((ns) => {
      if (
        ns.every(([dx, dy], index) => {
          const nplant = plot.getPlot(dx, dy).plant;
          return index === 1 ? nplant !== plot.plant : nplant === plot.plant;
        })
      ) {
        result++;
      }
    });
  }
  return result;
};

const secondTask = (input) => {
  const regions = findAllRegions(input);
  const sides = regions.map((region) => calcSides(region) * region.area);
  return sum(sides);
};

console.log(firstTask(readFile("./src/12/input")));
console.log(secondTask(readFile("./src/12/input")));
