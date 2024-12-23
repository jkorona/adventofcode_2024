// https://adventofcode.com/2024/day/23
const { readFile } = require("../io");
const { memoize } = require("../utils");

const data = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`.trim();

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

const parse = (input) => input.split("\n").reduce((network, connection) => {
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

function findAllSubnetworks(network) {
  const visited = new Set();
  const cycles = [];

  function dfs(node, parent, path) {
      visited.add(node);
      path.push(node);

      for (const neighbor of network[node].connections) {
          if (neighbor.name === parent) {
              // Skip the edge we just came from
              continue;
          }
          if (!visited.has(neighbor.name)) {
              // Recur for unvisited neighbors
              dfs(neighbor.name, node, path);
          } else if (path.includes(neighbor.name)) {
              // Cycle detected
              const cycleStartIndex = path.indexOf(neighbor);
              const cycle = path.slice(cycleStartIndex);
              cycles.push([...cycle, neighbor.name]);
          }
      }

      path.pop(); // Backtrack
  }

  for (const node in network) {
      if (!visited.has(node)) {
          dfs(node, null, []);
      }
  }

  return cycles;
}

const firstTask = (input) => {
  const network = parse(input);

  const subnetworks = findSubNetworks(network);
  return subnetworks.filter((subnetwork) => /(^|\-)t/.test(subnetwork)).length;
};

const secondTask = (input) => {
  const network = parse(input);
  return findAllSubnetworks(network);
}

// console.log(firstTask(data));
// console.log(firstTask(readFile("./src/23/input")));
console.log(secondTask(data));
// console.log(secondTask(readFile("./src/23/input")))
