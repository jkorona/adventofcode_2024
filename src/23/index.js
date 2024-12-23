// https://adventofcode.com/2024/day/23
const { readFile } = require("../io");
const { memoize } = require("../utils");

const computer = (name) => {
  const connections = [];
  return {
    name,
    addConnection: (connection) => connections.push(connection),
    get connections() {
      return connections;
    },
    get nrOfConnections() {
      return connections.length;
    },
  };
};

const parse = (input) =>
  input.split("\n").reduce((network, connection) => {
    const [a, b] = connection.split("-");
    const computerA = network[a] || computer(a);
    const computerB = network[b] || computer(b);

    computerA.addConnection(computerB);
    computerB.addConnection(computerA);

    network[a] = computerA;
    network[b] = computerB;

    return network;
  }, {});

const findSubNetworks = (network) => {
  const subnetworks = new Set();
  const nodes = Object.keys(network);

  const findPeers = memoize(
    (node, subnetwork) => {
      if (node === subnetwork.at(0)) {
        if (subnetwork.length === 3) {
          subnetworks.add(subnetwork.sort().join("-"));
        }
      } else if (subnetwork.length < 3) {
        network[node].connections.forEach((connection) => {
          findPeers(connection.name, [...subnetwork, node]);
        });
      }
    },
    (node, subnetwork) => [node, ...subnetwork].join("-")
  );

  while (nodes.length > 0) {
    findPeers(nodes.shift(), []);
  }

  return Array.from(subnetworks.values());
};

function findCliques(network) {
  const cliques = [];

  function bronKerbosch(current, nodes, visited) {
    if (nodes.length === 0 && visited.length === 0) {
      cliques.push([...current]);
      return;
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const neighbors = network[node].connections.map(({ name }) => name);

      bronKerbosch(
        [...current, node],
        nodes.filter((v) => neighbors.includes(v)),
        visited.filter((v) => neighbors.includes(v))
      );

      nodes.splice(i, 1);
      visited.push(node);
    }
  }

  const nodes = Object.keys(network);
  bronKerbosch([], nodes, []);

  return cliques;
}

const firstTask = (input) => {
  const network = parse(input);

  const subnetworks = findSubNetworks(network);
  return subnetworks.filter((subnetwork) => /(^|\-)t/.test(subnetwork)).length;
};

const secondTask = (input) => {
  const network = parse(input);

  const biggestLAN = findCliques(network).reduce((biggest, subnetwork) => {
    if (subnetwork.length > biggest.length) {
      return subnetwork;
    }
    return biggest;
  });

  return biggestLAN.sort().join(",");
};

console.log(firstTask(readFile("./src/23/input")));
console.log(secondTask(readFile("./src/23/input")))
