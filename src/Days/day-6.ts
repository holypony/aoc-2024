import { fetchInput } from "../Utils/fetch-input";

export const checkCoords = (grid: Grid, x: number, y: number) => {
    return y >= grid.length ||
        y < 0 ||
        x >= grid[y].length ||
        x < 0
}

export enum Direction {
    UP,
    UP_RIGHT,
    RIGHT,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    UP_LEFT,
};


export type SearchFindFunction = (currChar: string, x: number, y: number) => boolean;

export type Grid = Array<Array<string>>;

export const searchDirection = (grid: Grid, x: number, y: number, direction: Direction, find: SearchFindFunction): boolean => {
    if (checkCoords(grid, x, y)) {
        console.log('Search ended: Out of bounds');
        return false;
    }

    if (!find(grid[y][x], x, y)) {
        console.log('Search ended: Function finished');
        return false;
    }

    switch (direction) {
        case Direction.UP:
            return searchDirection(grid, x, y - 1, direction, find);

        case Direction.UP_RIGHT:
            return searchDirection(grid, x + 1, y - 1, direction, find);

        case Direction.RIGHT:
            return searchDirection(grid, x + 1, y, direction, find);

        case Direction.BOTTOM_RIGHT:
            return searchDirection(grid, x + 1, y + 1, direction, find);

        case Direction.BOTTOM:
            return searchDirection(grid, x, y + 1, direction, find);

        case Direction.BOTTOM_LEFT:
            return searchDirection(grid, x - 1, y + 1, direction, find);

        case Direction.LEFT:
            return searchDirection(grid, x - 1, y, direction, find);

        case Direction.UP_LEFT:
            return searchDirection(grid, x - 1, y - 1, direction, find);

        default:
            console.log('Search ended: Invalid direction');
            return false;
    }
}

export const gridSearch = (grid: Grid, st: SearchFindFunction): [x: number, y: number] => {
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (!st(char, x, y))
                return [x, y];
        }
    }

    return [-1, -1];
}

export const makeGridFromMultilineString =
    (input: string) => input.split("\n").map(st => st.trim()).map(v => v.split(""));

export const duplicate2DArray = <T>(array: Array<Array<T>>) => {
    return [...array.map((item) => [...item])];
}



const getNextDirection = (dir: Direction) => {
    switch (dir) {
        case Direction.UP:
            return Direction.RIGHT;
        case Direction.RIGHT:
            return Direction.BOTTOM;
        case Direction.BOTTOM:
            return Direction.LEFT;
        case Direction.LEFT:
            return Direction.UP;
        default:
            throw Error("Invalid");
    }
}



const checkForLoops = (grid: Grid, x: number, y: number, dir: Direction) => {
    const visitedPositions = new Set<string>();

    const addToVisitedPositions = (x: number, y: number, dir: Direction) => {
        const positionKey = `${x}:${y}:${dir}`;
        if (visitedPositions.has(positionKey))
            return false;
        visitedPositions.add(positionKey);
        return true;
    }

    let shouldContinue = true;
    let res = true;
    let i = 0; 
    let [lastX, lastY] = [x, y];
    while (shouldContinue && i++ < 10000) {
        shouldContinue = searchDirection(grid, lastX, lastY, dir, (ch, currX, currY) => {
            if (ch == "#")
                return false;

            [lastX, lastY] = [currX, currY];

            res = addToVisitedPositions(currX, currY, dir);
            return res;
        });

        if (!res)
            break;

        dir = getNextDirection(dir);
    }

    return res;
}


export const solutionDaySix = async () => {
    const input = await fetchInput(6);

    const grid = makeGridFromMultilineString(input);
    const visited = new Map<string, [x: number, y: number, dir: Direction, prevX: number, prevY: number]>();
    let [x, y] = gridSearch(grid, (ch) => ch !== "^");
    const [initialX, initialY] = [x, y];
    let dir: Direction = Direction.UP;

    const addToVisited = (visitedX: number, visitedY: number, dir: Direction) => {
        const loc = `${visitedX}:${visitedY}`;
        if (!visited.has(loc))
            visited.set(loc, [visitedX, visitedY, dir, x, y]);
    }

    addToVisited(x, y, dir);

    let shouldContinue = true;
    let i = 0; 
    while (shouldContinue && i++ < 10000) {
        shouldContinue = searchDirection(grid, x, y, dir, (ch, currX, currY) => {
            if (ch == "#")
                return false;

            addToVisited(currX, currY, dir);
            [x, y] = [currX, currY];
            return true;
        });
        dir = getNextDirection(dir);
    }

    const sum1 = visited.size;

    visited.delete(`${initialX}:${initialY}`);

    let sum = 0;
    visited.forEach((v) => {
        const [visitedX, visitedY, visitedDirection, prevX, prevY] = v;
        const newGrid = duplicate2DArray(grid);
        newGrid[visitedY][visitedX] = "#"; 

        if (!checkForLoops(newGrid, prevX, prevY, visitedDirection))
            sum++;
    });
    console.log(sum);
    return {
  
        sum,
    }
}