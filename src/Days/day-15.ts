import { fetchInput } from "../Utils/fetch-input";

const testInput = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;

type Cell = {
  value: string;
  x: number;
  y: number;
  left: Cell | null;
  right: Cell | null;
  up: Cell | null;
  down: Cell | null;
};

// robot @
// wall #
// box O
// empty .

const map = new Map<string, Cell>();
let robotInstructions: string;
let currentRobotPosition = { x: 0, y: 0 };
const coors = new Set<string>();
const generateMap = (grid: string[][]) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") {
        currentRobotPosition = { x, y };
      }
      if (grid[y][x] === "O") {
        coors.add(`${x}:${y}`);
      }
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

const parseInput = (input: string) => {
  // split input by empty line
  const lines = input.split("\n\n");
  const grid = lines[0].split("\n").map((line) => line.split(""));
  const instructions = lines[1];
  return { grid, instructions };
};

export const mainDayFifteen = async () => {
  const input = await fetchInput(15);
  const { grid, instructions } = parseInput(input);
  generateMap2(grid);

  for (const instruction of instructions) {
    move3(instruction);
    //visualizeMap();
  }
  //   visualizeMap();
  //   move2("<");
  //   visualizeMap();
  //   move2("^");
  //   visualizeMap();
  //   move2("^");
  //   visualizeMap();

  let sum2 = 0;
  //calculate sum of coordinates of [ map2
  for (const cell of map2.values()) {
    if (cell.value === "[") {
      sum2 += cell.x + cell.y * 100;
    }
  }
  console.log(sum2);

  //   robotInstructions = instructions;
  //   generateMap(grid);

  //   for (const instruction of robotInstructions) {
  //     move(map, instruction);
  //     visualizeMap();
  //   }

  //   let sum1 = 0;
  //   for (const box of coors) {
  //     const [x, y] = box.split(":").map(Number);
  //     console.log(x, y);
  //     sum1 += x + y * 100;
  //   }
  //   console.log(sum1);

  return sum2;
};

const move = (map: Map<string, Cell>, instruction: string) => {
  const startCell = map.get(`${currentRobotPosition.x}:${currentRobotPosition.y}`);

  if (startCell.value !== "@") {
    console.error("SUQA");
  }
  if (instruction === "^") {
    const upCell = map.get(`${startCell.x}:${startCell.y - 1}`);
    if (upCell.value === "#") return;
    if (upCell.value === ".") {
      map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
      map.set(`${upCell.x}:${upCell.y}`, { ...upCell, value: "@" });
      currentRobotPosition = { x: upCell.x, y: upCell.y };
      return;
    }
    if (upCell.value === "O") {
      const boxCell = upCell;
      let nextCell: Cell = map.get(`${boxCell.x}:${boxCell.y}`);

      for (let i = 0; i < 100; i++) {
        nextCell = map.get(`${nextCell.x}:${nextCell.y - 1}`);
        if (nextCell.value === "#") {
          return;
        }
        if (nextCell.value === ".") {
          // playe stay at box cell
          if (coors.has(`${boxCell.x}:${boxCell.y}`)) {
            coors.delete(`${boxCell.x}:${boxCell.y}`);
            coors.add(`${nextCell.x}:${nextCell.y}`);
          }
          map.set(`${boxCell.x}:${boxCell.y}`, { ...boxCell, value: "@" });
          currentRobotPosition = { x: boxCell.x, y: boxCell.y };
          // set dot instaed player position
          map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
          // replace box with last dot in loop
          map.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "O" });
          return;
        }
      }
    }
  }
  if (instruction === "v") {
    const downCell = map.get(`${startCell.x}:${startCell.y + 1}`);
    if (downCell.value === "#") return;
    if (downCell.value === ".") {
      map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
      map.set(`${downCell.x}:${downCell.y}`, { ...downCell, value: "@" });
      currentRobotPosition = { x: downCell.x, y: downCell.y };
      return;
    }
    if (downCell.value === "O") {
      const boxCell = downCell;
      // parse a row for find dot
      let nextCell: Cell = map.get(`${boxCell.x}:${boxCell.y}`);
      for (let i = 0; i < 100; i++) {
        nextCell = map.get(`${nextCell.x}:${nextCell.y + 1}`);
        if (nextCell.value === "#") {
          return;
        }
        if (nextCell.value === ".") {
          if (coors.has(`${boxCell.x}:${boxCell.y}`)) {
            coors.delete(`${boxCell.x}:${boxCell.y}`);
            coors.add(`${nextCell.x}:${nextCell.y}`);
          }
          // playe stay at box cell
          map.set(`${boxCell.x}:${boxCell.y}`, { ...boxCell, value: "@" });
          currentRobotPosition = { x: boxCell.x, y: boxCell.y };
          // set dot instaed player position
          map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
          // replace box with last dot in loop
          const nextCellLeft = map.get(`${nextCell.x}:${nextCell.y}`);
          map.set(`${nextCell.x}:${nextCell.y}`, { ...nextCellLeft, value: "O" });
          return;
        }
      }
    }
  }

  if (instruction === "<") {
    const leftCell = map.get(`${startCell.x - 1}:${startCell.y}`);
    if (leftCell.value === "#") return;
    if (leftCell.value === ".") {
      map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
      map.set(`${leftCell.x}:${leftCell.y}`, { ...leftCell, value: "@" });
      currentRobotPosition = { x: leftCell.x, y: leftCell.y };
      return;
    }
    if (leftCell.value === "O") {
      const boxCell = leftCell;
      // parse a row for find dot
      let nextCell: Cell = map.get(`${boxCell.x}:${boxCell.y}`);
      for (let i = 0; i < 100; i++) {
        nextCell = map.get(`${nextCell.x - 1}:${nextCell.y}`);
        if (nextCell.value === "#") {
          return;
        }
        if (nextCell.value === ".") {
          if (coors.has(`${boxCell.x}:${boxCell.y}`)) {
            coors.delete(`${boxCell.x}:${boxCell.y}`);
            coors.add(`${nextCell.x}:${nextCell.y}`);
          }
          // playe stay at box cell
          map.set(`${boxCell.x}:${boxCell.y}`, { ...boxCell, value: "@" });
          currentRobotPosition = { x: boxCell.x, y: boxCell.y };
          // set dot instaed player position
          map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
          // replace box with last dot in loop
          map.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "O" });
          return;
        }
      }
    }
  }

  if (instruction === ">") {
    const rightCell = map.get(`${startCell.x + 1}:${startCell.y}`);
    if (rightCell.value === "#") return;
    if (rightCell.value === ".") {
      map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
      map.set(`${rightCell.x}:${rightCell.y}`, { ...rightCell, value: "@" });
      currentRobotPosition = { x: rightCell.x, y: rightCell.y };
      return;
    }
    if (rightCell.value === "O") {
      const boxCell = rightCell;

      // parse a row for find dot
      let nextCell: Cell = map.get(`${boxCell.x}:${boxCell.y}`);
      for (let i = 0; i < 100; i++) {
        nextCell = map.get(`${nextCell.x + 1}:${nextCell.y}`);
        if (nextCell.value === "#") {
          return;
        }
        if (nextCell.value === ".") {
          if (coors.has(`${boxCell.x}:${boxCell.y}`)) {
            coors.delete(`${boxCell.x}:${boxCell.y}`);
            coors.add(`${nextCell.x}:${nextCell.y}`);
          }
          // playe stay at box cell
          map.set(`${boxCell.x}:${boxCell.y}`, { ...boxCell, value: "@" });
          currentRobotPosition = { x: boxCell.x, y: boxCell.y };
          // set dot instaed player position
          map.set(`${startCell.x}:${startCell.y}`, { ...startCell, value: "." });
          // replace box with last dot in loop
          map.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "O" });

          return;
        }
      }
    }
  }
};

const getLeftCell = (cell: Cell) => {
  return map2.get(`${cell.x - 1}:${cell.y}`) ?? null;
};
const getRightCell = (cell: Cell) => {
  return map2.get(`${cell.x + 1}:${cell.y}`) ?? null;
};
const getUpCell = (cell: Cell) => {
  return map2.get(`${cell.x}:${cell.y - 1}`) ?? null;
};
const getDownCell = (cell: Cell) => {
  return map2.get(`${cell.x}:${cell.y + 1}`) ?? null;
};

const visualizeMap = () => {
  // Find map boundaries
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cell of map2.values()) {
    minX = Math.min(minX, cell.x);
    maxX = Math.max(maxX, cell.x);
    minY = Math.min(minY, cell.y);
    maxY = Math.max(maxY, cell.y);
  }

  // Create visualization
  for (let y = minY; y <= maxY; y++) {
    let line = "";

    // Y-axis label
    line += `${y.toString().padStart(2)} `;

    for (let x = minX; x <= maxX; x++) {
      const cell = map2.get(`${x}:${y}`);
      if (cell) {
        switch (cell.value) {
          case "@":
            line += "@"; // Robot
            break;
          case "#":
            line += "█"; // Wall
            break;
          case "O":
            line += "O"; // Box
            break;
          case ".":
            line += "·"; // Empty space
            break;
          case "[":
            line += "["; // Empty space
            break;
          case "]":
            line += "]"; // Empty space
            break;
          default:
            line += " ";
        }
      } else {
        line += " ";
      }
    }
    console.log(line);
  }

  // X-axis labels
  let xAxis = "  "; // Align with y-axis labels
  for (let x = minX; x <= maxX; x++) {
    xAxis += x % 10; // Use modulo to keep single digits for cleaner output
  }
  console.log(xAxis);
};
type BigBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
const map2 = new Map<string, Cell>();

const playerCoors = { x: 0, y: 0 };
const generateMap2 = (grid: string[][]) => {
  const newGrid: string[][] = [];

  for (let y = 0; y < grid.length; y++) {
    newGrid[y] = []; // Initialize row
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === ".") {
        // Convert one dot into two dots
        newGrid[y].push(".");
        newGrid[y].push(".");
      } else if (grid[y][x] === "#") {
        // Convert one wall into two walls
        newGrid[y].push("#");
        newGrid[y].push("#");
      } else if (grid[y][x] === "O") {
        // Convert one box into two dots (and track them in bigBoxesMap)
        newGrid[y].push("[");
        newGrid[y].push("]");
      } else if (grid[y][x] === "@") {
        // Handle robot position similarly
        playerCoors.x = newGrid[y].length;
        playerCoors.y = y;
        newGrid[y].push("@");
        newGrid[y].push(".");
      }
    }
  }

  for (let y = 0; y < newGrid.length; y++) {
    for (let x = 0; x < newGrid[y].length; x++) {
      //   if (y === 0 || y === grid.length - 1) {
      //     map2.set(`${x}:${y}`, { x, y, value: "#", left: null, right: null, up: null, down: null });
      //     continue;
      //   }
      if (newGrid[y][x] === "#") {
        map2.set(`${x}:${y}`, { x, y, value: "#", left: null, right: null, up: null, down: null });
      } else if (newGrid[y][x] === ".") {
        map2.set(`${x}:${y}`, { x, y, value: ".", left: null, right: null, up: null, down: null });
      } else if (newGrid[y][x] === "[") {
        map2.set(`${x}:${y}`, { x, y, value: "[", left: null, right: null, up: null, down: null });
      } else if (newGrid[y][x] === "]") {
        map2.set(`${x}:${y}`, { x, y, value: "]", left: null, right: null, up: null, down: null });
      } else if (newGrid[y][x] === "@") {
        map2.set(`${x}:${y}`, { x, y, value: "@", left: null, right: null, up: null, down: null });
      }
    }
  }
};

const move2 = (instruction: string) => {
  if (instruction === "<") {
    const nextCell = map2.get(`${playerCoors.x - 1}:${playerCoors.y}`);
    if (nextCell.value === "#") return;
    if (nextCell.value === ".") {
      map2.set(`${playerCoors.x}:${playerCoors.y}`, { ...nextCell, value: "." });
      map2.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "@" });
      playerCoors.x = nextCell.x;
      return;
    }
    if (nextCell.value === "]") {
      // find all boxes in a row
      const boxesInRow: string[] = [];
      let cell = nextCell;
      while (true) {
        if (cell.value === "#") return;
        if (cell.value === ".") break;
        boxesInRow.push(`${cell.x}:${cell.y}`);
        cell = map2.get(`${cell.x - 1}:${cell.y}`);
      }
      playerCoors.x--;
      const [x, y] = boxesInRow[boxesInRow.length - 1].split(":").map(Number);
      //set [] from leftest x to player coors
      for (let i = x - 1; i <= playerCoors.x - 2; i = i + 2) {
        map2.set(`${i}:${y}`, { ...map2.get(`${i}:${y}`), value: "[" });
        map2.set(`${i + 1}:${y}`, { ...map2.get(`${i + 1}:${y}`), value: "]" });
      }
      map2.set(`${playerCoors.x + 1}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x + 1}:${playerCoors.y}`),
        value: ".",
      });
      map2.set(`${playerCoors.x}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x}:${playerCoors.y}`),
        value: "@",
      });

      return;
    }
  }
  if (instruction === ">") {
    const nextCell = map2.get(`${playerCoors.x + 1}:${playerCoors.y}`);
    if (nextCell.value === "#") return;
    if (nextCell.value === ".") {
      map2.set(`${playerCoors.x}:${playerCoors.y}`, { ...nextCell, value: "." });
      map2.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "@" });
      playerCoors.x = nextCell.x;
      return;
    }
    if (nextCell.value === "[") {
      // find all boxes in a row
      const boxesInRow: string[] = [];
      let cell = nextCell;
      while (true) {
        if (cell.value === "#") return;
        if (cell.value === ".") break;
        boxesInRow.push(`${cell.x}:${cell.y}`);
        cell = map2.get(`${cell.x + 1}:${cell.y}`);
      }
      playerCoors.x++;
      const [x, y] = boxesInRow[0].split(":").map(Number);
      //set [] from player coors to rightest x
      for (let i = playerCoors.x + 1; i <= x + 1; i = i + 2) {
        map2.set(`${i}:${y}`, { ...map2.get(`${i}:${y}`), value: "[" });
        map2.set(`${i + 1}:${y}`, { ...map2.get(`${i + 1}:${y}`), value: "]" });
      }
      map2.set(`${playerCoors.x - 1}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x - 1}:${playerCoors.y}`),
        value: ".",
      });
      map2.set(`${playerCoors.x}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x}:${playerCoors.y}`),
        value: "@",
      });

      return;
    }
  }

  if (instruction === "^") {
    const nextCell = map2.get(`${playerCoors.x}:${playerCoors.y - 1}`);
    if (nextCell.value === "#") return;
    if (nextCell.value === ".") {
      map2.set(`${playerCoors.x}:${playerCoors.y}`, { ...nextCell, value: "." });
      map2.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "@" });
      playerCoors.y = nextCell.y;
      return;
    }
    // Handle box pushing up
    if (nextCell.value === "[" || nextCell.value === "]") {
      // Find the left part of the box if we hit the right part
      let boxLeftX = nextCell.value === "]" ? nextCell.x - 1 : nextCell.x;

      // Collect all boxes above (complete boxes)
      let overlappingBoxes: { x: number; y: number }[] = [];
      let currentY = nextCell.y;
      let scanning = true;

      while (scanning) {
        // Check both positions for the box (left and right parts)
        let leftCell = map2.get(`${boxLeftX}:${currentY}`);
        let rightCell = map2.get(`${boxLeftX + 1}:${currentY}`);

        if (leftCell.value === "#" || rightCell.value === "#") {
          return; // Hit a wall, can't move
        }

        if (leftCell.value === "[" && rightCell.value === "]") {
          overlappingBoxes.push({ x: boxLeftX, y: currentY });
          currentY--;
        } else if (leftCell.value === "." && rightCell.value === ".") {
          // Check one more position up for walls
          let nextLeftCell = map2.get(`${boxLeftX}:${currentY - 1}`);
          let nextRightCell = map2.get(`${boxLeftX + 1}:${currentY - 1}`);
          if (nextLeftCell.value === "#" || nextRightCell.value === "#") {
            return; // Can't move if there's a wall above the empty space
          }
          break;
        } else {
          currentY--;
        }
      }

      // Found empty space at currentY
      overlappingBoxes.sort((a, b) => a.y - b.y); // Sort by Y to move from top to bottom

      // Clear all old box positions
      for (const box of overlappingBoxes) {
        map2.set(`${box.x}:${box.y}`, {
          ...map2.get(`${box.x}:${box.y}`),
          value: ".",
        });
        map2.set(`${box.x + 1}:${box.y}`, {
          ...map2.get(`${box.x + 1}:${box.y}`),
          value: ".",
        });
      }

      // Set new box positions
      for (let i = 0; i < overlappingBoxes.length; i++) {
        const newY = currentY + i;
        map2.set(`${boxLeftX}:${newY}`, {
          ...map2.get(`${boxLeftX}:${newY}`),
          value: "[",
        });
        map2.set(`${boxLeftX + 1}:${newY}`, {
          ...map2.get(`${boxLeftX + 1}:${newY}`),
          value: "]",
        });
      }

      // Move player
      map2.set(`${playerCoors.x}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x}:${playerCoors.y}`),
        value: ".",
      });
      playerCoors.y--;
      map2.set(`${playerCoors.x}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x}:${playerCoors.y}`),
        value: "@",
      });

      return;
    }
  }

  if (instruction === "v") {
    const nextCell = map2.get(`${playerCoors.x}:${playerCoors.y + 1}`);
    if (nextCell.value === "#") return;
    if (nextCell.value === ".") {
      map2.set(`${playerCoors.x}:${playerCoors.y}`, { ...nextCell, value: "." });
      map2.set(`${nextCell.x}:${nextCell.y}`, { ...nextCell, value: "@" });
      playerCoors.y = nextCell.y;
      return;
    }
    // Handle box pushing down
    if (nextCell.value === "[" || nextCell.value === "]") {
      // Find the left part of the box if we hit the right part
      let boxLeftX = nextCell.value === "]" ? nextCell.x - 1 : nextCell.x;

      // Collect all overlapping boxes below
      let overlappingBoxes: { x: number; y: number }[] = [];
      let currentY = nextCell.y;
      let scanning = true;

      while (scanning) {
        let cell = map2.get(`${boxLeftX}:${currentY}`);
        if (cell.value === "[" || cell.value === "]") {
          overlappingBoxes.push({ x: boxLeftX, y: currentY });
          currentY++;
        } else if (cell.value === ".") {
          break;
        } else if (cell.value === "#") {
          return; // Hit a wall, can't move
        }
      }

      // Found empty space at currentY
      // Move all boxes down one position
      overlappingBoxes.sort((a, b) => b.y - a.y); // Sort by Y to move from bottom to top

      // Clear all old box positions
      for (const box of overlappingBoxes) {
        map2.set(`${box.x}:${box.y}`, {
          ...map2.get(`${box.x}:${box.y}`),
          value: ".",
        });
        map2.set(`${box.x + 1}:${box.y}`, {
          ...map2.get(`${box.x + 1}:${box.y}`),
          value: ".",
        });
      }

      // Set new box positions
      for (let i = 0; i < overlappingBoxes.length; i++) {
        const newY = currentY - i - 1;
        map2.set(`${boxLeftX}:${newY}`, {
          ...map2.get(`${boxLeftX}:${newY}`),
          value: "[",
        });
        map2.set(`${boxLeftX + 1}:${newY}`, {
          ...map2.get(`${boxLeftX + 1}:${newY}`),
          value: "]",
        });
      }

      // Move player
      map2.set(`${playerCoors.x}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x}:${playerCoors.y}`),
        value: ".",
      });
      playerCoors.y++;
      map2.set(`${playerCoors.x}:${playerCoors.y}`, {
        ...map2.get(`${playerCoors.x}:${playerCoors.y}`),
        value: "@",
      });

      return;
    }
  }
};

type Point = { x: number; y: number };
type Dir = "<" | ">" | "^" | "v";

const getNextPosition = (current: Point, dir: Dir) => ({
  x: dir === "<" ? current.x - 1 : dir === ">" ? current.x + 1 : current.x,
  y: dir === "^" ? current.y - 1 : dir === "v" ? current.y + 1 : current.y,
});

const getMoveableBoxes = (current: Point, stack: Point[], dir: Dir) => {
  const nextPos = getNextPosition(current, dir);
  const nextCell = map2.get(`${nextPos.x}:${nextPos.y}`);
  if (!nextCell) return false;

  // Horizontal movement
  if (dir === "<" || dir === ">") {
    return handleHorizontalMovement(nextCell, nextPos, stack, dir);
  }
  // Vertical movement
  else {
    return handleVerticalMovement(nextCell, nextPos, stack, dir);
  }
};

const handleHorizontalMovement = (nextCell: Cell, nextPos: Point, stack: Point[], dir: Dir) => {
  if (nextCell.value === "#") return false;
  if (nextCell.value === ".") return stack;

  if ((nextCell.value === "]" && dir === "<") || (nextCell.value === "[" && dir === ">")) {
    const boxX = dir === "<" ? nextPos.x - 1 : nextPos.x;
    return getMoveableBoxes(
      { x: dir === "<" ? nextPos.x - 1 : nextPos.x + 1, y: nextPos.y },
      [...stack, { x: boxX, y: nextPos.y }],
      dir,
    );
  }

  return stack;
};

const handleVerticalMovement = (nextCell: Cell, nextPos: Point, stack: Point[], dir: Dir) => {
  if (nextCell.value === "#") return false;
  if (nextCell.value === ".") return stack;

  if (nextCell.value === "]") {
    return handleVerticalBoxPart(nextPos, stack, dir, true);
  }
  if (nextCell.value === "[") {
    return handleVerticalBoxPart(nextPos, stack, dir, false);
  }

  return stack;
};

const handleVerticalBoxPart = (nextPos: Point, stack: Point[], dir: Dir, isRightPart: boolean) => {
  const offset = isRightPart ? -1 : 1;
  const adjacentStack = getMoveableBoxes(
    { x: nextPos.x + offset, y: nextPos.y },
    [...stack, { x: nextPos.x + (isRightPart ? -1 : 0), y: nextPos.y }],
    dir,
  );
  if (adjacentStack === false) return false;
  return getMoveableBoxes(nextPos, [...adjacentStack], dir);
};

const sortBoxesByDirection = (boxes: Point[], dir: Dir) => {
  return boxes.sort((a, b) => {
    switch (dir) {
      case "<":
        return b.x - a.x;
      case ">":
        return a.x - b.x;
      case "^":
        return b.y - a.y;
      case "v":
        return a.y - b.y;
    }
  });
};

const getUniqueBoxes = (boxes: Point[]) => {
  return Array.from(new Set(boxes.map((b) => JSON.stringify(b)))).map((b) => JSON.parse(b));
};

const clearBoxPositions = (boxes: Point[]) => {
  boxes.forEach(({ x, y }) => {
    map2.set(`${x}:${y}`, { ...map2.get(`${x}:${y}`), value: "." });
    map2.set(`${x + 1}:${y}`, { ...map2.get(`${x + 1}:${y}`), value: "." });
  });
};

const placeBoxesInNewPositions = (boxes: Point[], dir: Dir) => {
  boxes.forEach(({ x, y }) => {
    const newPos = getNextPosition({ x, y }, dir);
    map2.set(`${newPos.x}:${newPos.y}`, { ...map2.get(`${newPos.x}:${newPos.y}`), value: "[" });
    map2.set(`${newPos.x + 1}:${newPos.y}`, { ...map2.get(`${newPos.x + 1}:${newPos.y}`), value: "]" });
  });
};

const movePlayer = (newPos: Point) => {
  map2.set(`${playerCoors.x}:${playerCoors.y}`, { ...map2.get(`${playerCoors.x}:${playerCoors.y}`), value: "." });
  playerCoors.x = newPos.x;
  playerCoors.y = newPos.y;
  map2.set(`${playerCoors.x}:${playerCoors.y}`, { ...map2.get(`${playerCoors.x}:${playerCoors.y}`), value: "@" });
};

const moveBoxes = (boxes: Point[], dir: Dir) => {
  const uniqueBoxes = getUniqueBoxes(boxes);
  if (uniqueBoxes.length === 0) return;

  const newPlayerPos = getNextPosition(playerCoors, dir);
  const sortedBoxes = sortBoxesByDirection(uniqueBoxes, dir);

  clearBoxPositions(sortedBoxes);
  placeBoxesInNewPositions(sortedBoxes, dir);
  movePlayer(newPlayerPos);
};

const move3 = (instruction: string) => {
  const nextPos = getNextPosition(playerCoors, instruction as Dir);
  const nextCell = map2.get(`${nextPos.x}:${nextPos.y}`);

  if (!nextCell || nextCell.value === "#") return;

  if (nextCell.value === ".") {
    movePlayer(nextPos);
    return;
  }

  if (nextCell.value === "[" || nextCell.value === "]") {
    const moveableBoxes = getMoveableBoxes(playerCoors, [], instruction as Dir);
    if (moveableBoxes !== false && moveableBoxes.length > 0) {
      moveBoxes(moveableBoxes, instruction as Dir);
    }
  }
};
