import { fetchInput } from "../Utils/fetch-input";
import * as fs from "fs";

const test =
  "p=0,4 v=3,-3\np=6,3 v=-1,-3\np=10,3 v=-1,2\np=2,0 v=2,-1\np=0,0 v=1,3\np=3,0 v=-2,-2\np=7,6 v=-1,-3\np=3,0 v=-1,-2\np=9,3 v=2,3\np=7,3 v=-1,2\np=2,4 v=2,-3\np=9,5 v=-3,-3";

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;
// const MAP_WIDTH = 11;
// const MAP_HEIGHT = 7;

const MAX_HALF_WIDTH = (MAP_WIDTH - 1) / 2;
const MAX_HALF_HEIGHT = (MAP_HEIGHT - 1) / 2;

const QUARTER_WIDTH = MAX_HALF_WIDTH / 2;
const QUARTER_HEIGHT = MAX_HALF_HEIGHT / 2;

type Cell = {
  quadrant: number;
  value: number;
  x: number;
  y: number;
};

type Robot = {
  id: number;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    vX: number;
    vY: number;
  };
  currentQuadrant: number;
};

const map = new Map<string, Cell>();
const robots = new Map<number, Robot>();

export const mainDayFourteen = async () => {
  const input = await fetchInput(14);

  generateMap();
  console.log(map.size);
  generateRobots(input);
  console.log(robots.size);

  const checkRobotsInArea = (x: number, y: number) => {
    let count = 0;
    if (map.get(`${x},${y}`).value >= 1) {
      count++;
    }
    if (map.get(`${x + 1},${y + 1}`).value >= 1) {
      count++;
    }
    if (map.get(`${x - 1},${y - 1}`).value >= 1) {
      count++;
    }
    if (map.get(`${x},${y - 1}`).value >= 1) {
      count++;
    }
    if (map.get(`${x},${y + 1}`).value >= 1) {
      count++;
    }
    if (map.get(`${x + 1},${y + 1}`).value >= 1) {
      count++;
    }
    if (map.get(`${x + 1},${y - 1}`).value >= 1) {
      count++;
    }
    if (map.get(`${x + 1},${y}`).value >= 1) {
      count++;
    }

    return count;
  };

  for (let i = 0; i < 11000; i++) {
    for (const robot of robots.values()) {
      moveRobot(robot, map);
    }
    if (checkRobotsInArea(MAX_HALF_WIDTH, MAX_HALF_HEIGHT) > 5) {
      visualizeMapTopLeft(map, robots, 2, `map_visualization_${i}.txt`);
    }
  }

  // count robots in every quadrant
  const robotsInQuadrant1 = Array.from(robots.values()).filter((robot) => robot.currentQuadrant === 1).length;
  const robotsInQuadrant2 = Array.from(robots.values()).filter((robot) => robot.currentQuadrant === 2).length;
  const robotsInQuadrant3 = Array.from(robots.values()).filter((robot) => robot.currentQuadrant === 3).length;
  const robotsInQuadrant4 = Array.from(robots.values()).filter((robot) => robot.currentQuadrant === 4).length;

  let sum = robotsInQuadrant1 * 1 + robotsInQuadrant2 * 2 + robotsInQuadrant3 * 3 + robotsInQuadrant4 * 4;
  return (
    " robotsInQuadrant1: " +
    robotsInQuadrant1 +
    " robotsInQuadrant2: " +
    robotsInQuadrant2 +
    " robotsInQuadrant3: " +
    robotsInQuadrant3 +
    " robotsInQuadrant4: " +
    robotsInQuadrant4 +
    " sum: " +
    sum
  );
};

const generateMap = () => {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      let quadrant = 0;
      if (x === MAX_HALF_WIDTH || y === MAX_HALF_HEIGHT) {
        quadrant = 0;
      } else if (x < MAX_HALF_WIDTH && y < MAX_HALF_HEIGHT) {
        quadrant = 1;
      } else if (x > MAX_HALF_WIDTH && y < MAX_HALF_HEIGHT) {
        quadrant = 2;
      } else if (x < MAX_HALF_WIDTH && y > MAX_HALF_HEIGHT) {
        quadrant = 3;
      } else if (x > MAX_HALF_WIDTH && y > MAX_HALF_HEIGHT) {
        quadrant = 4;
      }
      map.set(`${x},${y}`, { quadrant, value: 0, x, y });
    }
  }
};

const generateRobots = (input: string) => {
  const lines = input.split("\n");
  let id = 0;
  for (const line of lines) {
    if (line === "") continue;
    const [position, direction] = line.split(" ");
    const [x, y] = position.split("=")[1].split(",").map(Number);
    const newId = id++;
    const [vX, vY] = direction.split("=")[1].split(",").map(Number);

    const cell = map.get(`${x},${y}`);
    console.log(x, y);
    map.set(`${x},${y}`, { ...cell, value: cell.value + 1 });
    robots.set(newId, {
      id: newId,
      position: { x, y },
      velocity: { vX, vY },
      currentQuadrant: cell.quadrant,
    });
  }
};

const moveRobot = (robot: Robot, map: Map<string, Cell>) => {
  // check the next pos
  const nextPos = {
    x: robot.position.x + robot.velocity.vX,
    y: robot.position.y + robot.velocity.vY,
  };

  if (nextPos.x < 0) {
    nextPos.x = MAP_WIDTH + nextPos.x;
  }

  if (nextPos.y < 0) {
    nextPos.y = MAP_HEIGHT + nextPos.y;
  }

  if (nextPos.x >= MAP_WIDTH) {
    nextPos.x = nextPos.x % MAP_WIDTH;
  }

  if (nextPos.y >= MAP_HEIGHT) {
    nextPos.y = nextPos.y % MAP_HEIGHT;
  }

  let quadrant = 0;
  if (nextPos.x === MAX_HALF_WIDTH || nextPos.y === MAX_HALF_HEIGHT) {
    quadrant = 0;
  } else if (nextPos.x < MAX_HALF_WIDTH && nextPos.y < MAX_HALF_HEIGHT) {
    quadrant = 1;
  } else if (nextPos.x > MAX_HALF_WIDTH && nextPos.y < MAX_HALF_HEIGHT) {
    quadrant = 2;
  } else if (nextPos.x < MAX_HALF_WIDTH && nextPos.y > MAX_HALF_HEIGHT) {
    quadrant = 3;
  } else if (nextPos.x > MAX_HALF_WIDTH && nextPos.y > MAX_HALF_HEIGHT) {
    quadrant = 4;
  }

  const prevCell = map.get(`${robot.position.x},${robot.position.y}`);
  const cell = map.get(`${nextPos.x},${nextPos.y}`);

  robots.set(robot.id, {
    id: robot.id,
    position: {
      x: nextPos.x,
      y: nextPos.y,
    },
    velocity: robot.velocity,
    currentQuadrant: quadrant,
  });

  map.set(`${robot.position.x},${robot.position.y}`, {
    ...prevCell,
    value: prevCell.value - 1,
  });

  map.set(`${nextPos.x},${nextPos.y}`, {
    ...cell,
    value: cell.value + 1,
  });
};

function visualizeMapTopLeft(
  map: Map<string, Cell>,
  robots: Map<number, Robot>,
  padding: number = 2,
  outputFile?: string,
): void {
  // Find map boundaries
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // Check map cells and robots
  for (const cell of map.values()) {
    minX = Math.min(minX, cell.x);
    maxX = Math.max(maxX, cell.x);
    minY = Math.min(minY, cell.y);
    maxY = Math.max(maxY, cell.y);
  }

  for (const robot of robots.values()) {
    minX = Math.min(minX, robot.position.x);
    maxX = Math.max(maxX, robot.position.x);
    minY = Math.min(minY, robot.position.y);
    maxY = Math.max(maxY, robot.position.y);
  }

  // Add padding
  minX -= padding;
  maxX += padding;
  minY -= padding;
  maxY += padding;

  // Store lines for both console output and file
  const lines: string[] = [];

  // Create visualization
  for (let y = minY; y <= maxY; y++) {
    let line = "";

    // Y-axis labels
    line += `${y.toString().padStart(3)} `;

    for (let x = minX; x <= maxX; x++) {
      const cellKey = `${x},${y}`;
      const cell = map.get(cellKey);

      const robot = Array.from(robots.values()).find(
        (r) => Math.round(r.position.x) === x && Math.round(r.position.y) === y,
      );

      if (robot) {
        line += " @ "; // Robot symbol
      } else if (cell) {
        line += " . "; // Solid square for cells
      } else {
        line += " · "; // Empty space
      }
    }
    lines.push(line);
  }

  // X-axis labels
  let xAxis = "    "; // Align with y-axis labels
  for (let x = minX; x <= maxX; x++) {
    xAxis += `${x.toString().padStart(2)} `;
  }
  lines.push(xAxis);

  // Robot information
  lines.push("\nRobots:");
  for (const robot of robots.values()) {
    lines.push(
      `@${robot.id}: ` +
        `pos(${robot.position.x.toFixed(1)}, ${robot.position.y.toFixed(1)}) ` +
        `vel(${robot.velocity.vX.toFixed(1)}, ${robot.velocity.vY.toFixed(1)}) ` +
        `quad:${robot.currentQuadrant}`,
    );
  }

  // Print to console
  lines.forEach((line) => console.log(line));

  // Save to file if filename provided
  if (outputFile) {
    try {
      fs.writeFileSync(outputFile, lines.join("\n"), "utf-8");
      console.log(`\nMap saved to ${outputFile}`);
    } catch (error) {
      console.error("Error saving to file:", error);
    }
  }
}
