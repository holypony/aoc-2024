import { fetchInput } from "../Utils/fetch-input";

const testInput = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const testInput2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

export const mainDaySixteen = async () => {
  const input = await fetchInput(16);
  const grid = parseInput(input);
  generateMap(grid);

  const start = Array.from(map.values()).find((cell) => cell.value === "S")!;
  const end = Array.from(map.values()).find((cell) => cell.value === "E")!;

  const paths = findAllPaths(start, end);

  // Calculate and display costs for each path
  const pathCosts = paths.map((path) => {
    const moves = path.cells.length - 1; // Number of moves (excluding start position)
    const turns = countTurns(path.cells);
    const totalCost = moves + turns * 1000;

    return {
      path: path.cells.map((cell) => `(${cell.x},${cell.y})`).join(" -> "),
      moves,
      turns,
      totalCost,
      uniqueCells: path.uniqueCells,
    };
  });

  // Sort by total cost
  pathCosts.sort((a, b) => a.totalCost - b.totalCost);

  // Log details for each path
  pathCosts.forEach((pathInfo, index) => {
    console.log(`Path ${index + 1}:`);

    console.log(`  Total Cost: ${pathInfo.totalCost}`);
    console.log(`  Moves: ${pathInfo.moves}`);
    console.log(`  Unique Cells: ${pathInfo.uniqueCells.size}`);

    console.log("---");
  });

  return pathCosts[0].totalCost.toString();
};

function countTurns(cells: Cell[]): number {
  let turns = 0;
  let currentDirection: Direction = "right"; // Set initial direction to right

  for (let i = 0; i < cells.length - 1; i++) {
    const current = cells[i];
    const next = cells[i + 1];

    // Get the next direction
    const nextDirection = getDirection(current, next);

    // Check if direction changes
    if (currentDirection !== nextDirection) {
      turns++;
    }

    // Update current direction for next iteration
    currentDirection = nextDirection;
  }

  return turns;
}

function getDirection(from: Cell, to: Cell): Direction {
  if (to.x > from.x) return "right";
  if (to.x < from.x) return "left";
  if (to.y > from.y) return "down";
  return "up";
}

type Cell = {
  value: string;
  x: number;
  y: number;
  left: Cell | null;
  right: Cell | null;
  up: Cell | null;
  down: Cell | null;
};

const map = new Map<string, Cell>();

const parseInput = (input: string) => {
  return input.split("\n").map((line) => line.split(""));
};

const generateMap = (grid: string[][]) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = { x, y, value: grid[y][x], left: null, right: null, up: null, down: null };
      map.set(`${x}:${y}`, cell);
    }
  }

  for (const cell of map.values()) {
    cell.left = getLeftCell(cell);
    cell.right = getRightCell(cell);
    cell.up = getUpCell(cell);
    cell.down = getDownCell(cell);
  }
};

const getLeftCell = (cell: Cell) => {
  return map.get(`${cell.x - 1}:${cell.y}`) ?? null;
};
const getRightCell = (cell: Cell) => {
  return map.get(`${cell.x + 1}:${cell.y}`) ?? null;
};
const getUpCell = (cell: Cell) => {
  return map.get(`${cell.x}:${cell.y - 1}`) ?? null;
};
const getDownCell = (cell: Cell) => {
  return map.get(`${cell.x}:${cell.y + 1}`) ?? null;
};

// Add direction type to track last movement
type Direction = "up" | "down" | "left" | "right" | "none";

const move = () => {
  // you know whole map start and finish and walls find all possible paths
};

type Path = {
  cells: Cell[];
  cost: number;
  lastDirection: Direction;
  uniqueCells: Set<Cell>;
};

// Add this type for the priority queue
type QueueEntry = {
  cell: Cell;
  cost: number;
  lastDirection: Direction;
  path: Cell[];
};

const findAllPaths = (start: Cell, end: Cell): Path[] => {
  // Priority queue to store paths to explore (using array as simple implementation)
  const queue: QueueEntry[] = [];
  // Track best cost to reach each cell from each direction
  const bestCosts = new Map<string, Map<Direction, number>>();

  // Initialize start position
  queue.push({ cell: start, cost: 0, lastDirection: "right", path: [start] });

  const paths: Path[] = [];
  const uniqueCells = new Set<Cell>();
  while (queue.length > 0) {
    // Get the lowest cost path
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift()!;
    uniqueCells.add(current.cell);
    // Found the end
    if (current.cell === end) {
      paths.push({
        cells: current.path,
        cost: current.cost,
        lastDirection: current.lastDirection,
        uniqueCells,
      });
      continue;
    }

    // Check if we've found a better path to this cell from this direction
    const key = `${current.cell.x}:${current.cell.y}`;
    const directionCosts = bestCosts.get(key) || new Map();
    if (directionCosts.get(current.lastDirection) ?? Infinity <= current.cost) {
      continue;
    }
    directionCosts.set(current.lastDirection, current.cost);
    bestCosts.set(key, directionCosts);

    // Define possible moves
    const moves: Array<[Cell | null, Direction]> = [
      [current.cell.right, "right"],
      [current.cell.left, "left"],
      [current.cell.up, "up"],
      [current.cell.down, "down"],
    ];

    for (const [nextCell, direction] of moves) {
      if (!nextCell || nextCell.value === "#") continue;

      const turnCost = current.lastDirection === direction ? 0 : 1000;
      const newCost = current.cost + 1 + turnCost;

      queue.push({
        cell: nextCell,
        cost: newCost,
        lastDirection: direction,
        path: [...current.path, nextCell],
      });
    }
  }

  return paths.sort((a, b) => a.cost - b.cost);
};
