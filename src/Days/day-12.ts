import { fetchInput } from "../Utils/fetch-input";

const test =
  "RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE";

type Cell = {
  x: number;
  y: number;
  value: string;
  left: Cell | null;
  right: Cell | null;
  up: Cell | null;
  down: Cell | null;
};

type Island = {
  cells: Cell[];
  perimeter: number;
};

const map = new Map<string, Cell>();
const islands = new Map<string, Island>();
const visitedCells = new Set<string>();

let MAP_WIDTH = 0;
let MAP_HEIGHT = 0;

export const mainDayTwelve = async () => {
  const input = await fetchInput(12);

  const grid = makeGridFromMultilineString(input);
  const map = generateMap(grid);

  // part 1 ;(
  // for (const cell of map.values()) {
  //   move(map, null, cell);
  // }

  console.log("e ", calc(map));
  return "sum";
};

const makeGridFromMultilineString = (input: string) =>
  input
    .split("\n")
    .map((st) => st.trim())
    .map((v) => v.split(""));

const generateMap = (grid: string[][]) => {
  MAP_WIDTH = grid[0].length;
  MAP_HEIGHT = grid.length;

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

  console.log("MAP GENERATED ", map.size, MAP_WIDTH, MAP_HEIGHT);
  return map;
};

enum Direction {
  UP = "up",
  RIGHT = "right",
  DOWN = "down",
  LEFT = "left",
}

const isValidDirection = (prev: Direction, current: Direction) => {
  if (prev === Direction.DOWN && current === Direction.UP) {
    return false;
  }
  if (prev === Direction.UP && current === Direction.DOWN) {
    return false;
  }
  if (prev === Direction.RIGHT && current === Direction.LEFT) {
    return false;
  }
  if (prev === Direction.LEFT && current === Direction.RIGHT) {
    return false;
  }
  return true;
};

const islandEdges = new Map<string, number>();

let i = 0;

const edgeRunner = (island: Island, currentCell: Cell | null, direction: Direction | null = null) => {
  i++;
  if (i > 10) {
    return;
  }
  const startCell = island.cells[0];

  if (currentCell === startCell) {
    return;
  }

  if (!currentCell) {
    islandEdges.set(`${startCell.x}:${startCell.y}`, 0);
    currentCell = startCell;
  }
  console.log("currentCell", currentCell.x, currentCell.y);

  if (currentCell.up?.value === currentCell.value) {
    if (!direction) {
      direction = Direction.UP;
    } else {
      if (direction !== Direction.UP) {
        direction = Direction.UP;
        islandEdges.set(`${currentCell.x}:${currentCell.y}`, islandEdges.get(`${currentCell.x}:${currentCell.y}`) + 1);
      }
    }
    edgeRunner(island, currentCell.up, direction);
    return;
  }

  if (currentCell.right?.value === currentCell.value) {
    if (!direction) {
      direction = Direction.RIGHT;
    } else {
      if (direction !== Direction.RIGHT) {
        direction = Direction.RIGHT;
        islandEdges.set(`${currentCell.x}:${currentCell.y}`, islandEdges.get(`${currentCell.x}:${currentCell.y}`) + 1);
      }
    }
    edgeRunner(island, currentCell.right, direction);
    return;
  }

  if (currentCell.down?.value === currentCell.value) {
    if (!direction) {
      direction = Direction.DOWN;
    } else {
      if (direction !== Direction.DOWN) {
        direction = Direction.DOWN;
        islandEdges.set(`${currentCell.x}:${currentCell.y}`, islandEdges.get(`${currentCell.x}:${currentCell.y}`) + 1);
      }
    }
    edgeRunner(island, currentCell.down, direction);
    return;
  }

  if (currentCell.left?.value === currentCell.value) {
    if (!direction) {
      direction = Direction.LEFT;
    } else {
      if (direction !== Direction.LEFT) {
        direction = Direction.LEFT;
        islandEdges.set(`${currentCell.x}:${currentCell.y}`, islandEdges.get(`${currentCell.x}:${currentCell.y}`) + 1);
      }
    }
    edgeRunner(island, currentCell.left, direction);
    return;
  }
};

const move = (map: Map<string, Cell>, startCell: Cell | null, currentCell: Cell) => {
  if (visitedCells.has(`${currentCell.x}:${currentCell.y}`)) {
    return;
  }
  visitedCells.add(`${currentCell.x}:${currentCell.y}`);

  if (!startCell) {
    startCell = currentCell;
    islands.set(`${currentCell.x}:${currentCell.y}`, {
      cells: [...(islands.get(`${currentCell.x}:${currentCell.y}`)?.cells ?? []), currentCell],
      perimeter: 0,
    });
  } else {
    const getIsland = islands.get(`${startCell.x}:${startCell.y}`);

    islands.set(`${startCell.x}:${startCell.y}`, {
      cells: [...getIsland.cells, currentCell],
      perimeter: getIsland.perimeter,
    });
  }

  if (currentCell.right?.value) {
    if (currentCell.right.value === currentCell.value) {
      move(map, startCell, currentCell.right);
    } else {
      const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
      islands.set(`${startCell.x}:${startCell.y}`, {
        cells: [...getIsland.cells],
        perimeter: getIsland.perimeter + 1,
      });
    }
  } else {
    const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
    islands.set(`${startCell.x}:${startCell.y}`, {
      cells: [...getIsland.cells],
      perimeter: getIsland.perimeter + 1,
    });
  }

  if (currentCell.left?.value) {
    if (currentCell.left.value === currentCell.value) {
      move(map, startCell, currentCell.left);
    } else {
      const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
      islands.set(`${startCell.x}:${startCell.y}`, {
        cells: [...getIsland.cells],
        perimeter: getIsland.perimeter + 1,
      });
    }
  } else {
    const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
    islands.set(`${startCell.x}:${startCell.y}`, {
      cells: [...getIsland.cells],
      perimeter: getIsland.perimeter + 1,
    });
  }

  if (currentCell.up?.value) {
    if (currentCell.up.value === currentCell.value) {
      move(map, startCell, currentCell.up);
    } else {
      const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
      islands.set(`${startCell.x}:${startCell.y}`, {
        cells: [...getIsland.cells],
        perimeter: getIsland.perimeter + 1,
      });
    }
  } else {
    const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
    islands.set(`${startCell.x}:${startCell.y}`, {
      cells: [...getIsland.cells],
      perimeter: getIsland.perimeter + 1,
    });
  }

  if (currentCell.down?.value) {
    if (currentCell.down.value === currentCell.value) {
      move(map, startCell, currentCell.down);
    } else {
      const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
      islands.set(`${startCell.x}:${startCell.y}`, {
        cells: [...getIsland.cells],
        perimeter: getIsland.perimeter + 1,
      });
    }
  } else {
    const getIsland = islands.get(`${startCell.x}:${startCell.y}`);
    islands.set(`${startCell.x}:${startCell.y}`, {
      cells: [...getIsland.cells],
      perimeter: getIsland.perimeter + 1,
    });
  }
  return;
};

// get left cell
const getLeftCell = (cell: Cell) => {
  return map.get(`${cell.x - 1}:${cell.y}`) ?? null;
};

// get right cell
const getRightCell = (cell: Cell) => {
  return map.get(`${cell.x + 1}:${cell.y}`) ?? null;
};

// get up cell
const getUpCell = (cell: Cell) => {
  return map.get(`${cell.x}:${cell.y - 1}`) ?? null;
};

// get down cell
const getDownCell = (cell: Cell) => {
  return map.get(`${cell.x}:${cell.y + 1}`) ?? null;
};

function visualizeIsland(allCells: Cell[], outerCells: Cell[]) {
  const outerSet = new Set(outerCells.map((cell) => `${cell.x},${cell.y}`));

  // Знаходимо розміри сітки
  const maxX = Math.max(...allCells.map((c) => c.x));
  const maxY = Math.max(...allCells.map((c) => c.y));

  // Створюємо Set всіх клітин для швидкого пошуку
  const cellSet = new Set(allCells.map((cell) => `${cell.x},${cell.y}`));

  // Виводимо сітку
  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      if (!cellSet.has(`${x},${y}`)) {
        line += " ";
      } else if (outerSet.has(`${x},${y}`)) {
        line += "O"; // Зовнішні клітини
      } else {
        line += "I"; // Внутрішні клітини
      }
    }
    console.log(line);
  }
}

interface Perimeter {
  x: number;
  y: number;
  valid: boolean;
}

const UP = "0",
  RIGHT = "1",
  DOWN = "2",
  LEFT = "3";

const go = (
  map: Map<string, Cell>,
  data: { area: number; perimeter: { [key: string]: Perimeter[] } },
  visited: Set<string>,
  currentCell: Cell,
) => {
  if (visited.has(`${currentCell.x},${currentCell.y}`)) return;
  visited.add(`${currentCell.x},${currentCell.y}`);

  data.area++;

  if (currentCell.y === 0 || currentCell.up?.value !== currentCell.value)
    data.perimeter[UP].push({ x: currentCell.x, y: currentCell.y, valid: true });
  if (currentCell.y === MAP_HEIGHT - 1 || currentCell.down?.value !== currentCell.value)
    data.perimeter[DOWN].push({ x: currentCell.x, y: currentCell.y, valid: true });
  if (currentCell.x === 0 || currentCell.left?.value !== currentCell.value)
    data.perimeter[LEFT].push({ x: currentCell.x, y: currentCell.y, valid: true });
  if (currentCell.x === MAP_WIDTH - 1 || currentCell.right?.value !== currentCell.value)
    data.perimeter[RIGHT].push({ x: currentCell.x, y: currentCell.y, valid: true });

  if (currentCell.y !== 0 && currentCell.up?.value === currentCell.value) go(map, data, visited, currentCell.up);
  if (currentCell.y !== MAP_HEIGHT - 1 && currentCell.down?.value === currentCell.value)
    go(map, data, visited, currentCell.down);
  if (currentCell.x !== 0 && currentCell.left?.value === currentCell.value) go(map, data, visited, currentCell.left);
  if (currentCell.x !== MAP_WIDTH - 1 && currentCell.right?.value === currentCell.value)
    go(map, data, visited, currentCell.right);
};

const calc = (map: Map<string, Cell>) => {
  let alreadyWalked = new Set<string>();
  let sum = 0;
  for (const cell of map.values()) {
    if (!alreadyWalked.has(`${cell.x},${cell.y}`)) {
      let data: { area: number; perimeter: { [key: string]: Perimeter[] } } = {
        area: 0,
        perimeter: { [UP]: [], [DOWN]: [], [LEFT]: [], [RIGHT]: [] },
      };
      let visited = new Set<string>();
      go(map, data, visited, cell);
      // colapse visited and alreadyWalked
      alreadyWalked = new Set([...alreadyWalked, ...visited]);

      Object.keys(data.perimeter).forEach((direction) => {
        if (direction === UP || direction === DOWN) filterPerimeters(data.perimeter[direction], "x", "y");
        if (direction === LEFT || direction === RIGHT) filterPerimeters(data.perimeter[direction], "y", "x");
      });

      console.log("data", data.perimeter);

      sum +=
        data.area *
        Object.values(data.perimeter).reduce(
          (sum, array) => sum + array.filter((perimeter) => perimeter.valid).length,
          0,
        );
    }
  }
  return sum;
};

const filterPerimeters = (array: Perimeter[], primary: "x" | "y", secondary: "x" | "y") => {
  array.sort((a, b) => a[primary] - b[primary]);

  for (let i = 0; i < array.length; i++) {
    let check = array[i][primary];
    while (true) {
      check++;
      const nextNode = array.find((node) => node[primary] === check && node[secondary] === array[i][secondary]);

      if (nextNode !== undefined) nextNode.valid = false;
      else break;
    }
  }
};
