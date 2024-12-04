import { fetchInput } from "../Utils/fetch-input";

function stringToGrid(input: string): string[][] {
    
    return input
        .split('\n')      
        .map(line => 
            line.split('') 
        );
}

// vectors
const vectors = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // down-right
    [-1, 1],  // up-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // up-left
    [1, -1]   // down-left
];

const diagonalVectors = [
    [1, 1],   // down-right
    [-1, 1],  // up-right
    [-1, -1], // up-left
    [1, -1]   // down-left
];

function findAllXMAS(grid: string[][]): { word: string, start: [number, number], direction: string }[] {

    // map 
    const height = grid.length;
    const width = grid[0].length;

    // save
    const found: { word: string, start: [number, number], direction: string }[] = [];
    const target = "XMAS";

    

    const isValid = (y: number, x: number) => 
        y >= 0 && y < height && x >= 0 && x < width;
    function checkDirection(startY: number, startX: number, vy: number, vx: number): boolean {
        let word = "";
        let y = startY;
        let x = startX;

        for (let i = 0; i < target.length; i++) {
            if (!isValid(y, x)) return false;
            word += grid[y][x];
            y += vy;
            x += vx;
        }

        return word === target;
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            vectors.forEach(([vy, vx]) => {
                if (checkDirection(y, x, vy, vx)) {
                    let direction = "";
                    if (vy === -1 && vx === 0) direction = "up";
                    else if (vy === 1 && vx === 0) direction = "down";
                    else if (vy === 0 && vx === 1) direction = "right";
                    else if (vy === 0 && vx === -1) direction = "left";
                    else if (vy === 1 && vx === 1) direction = "down-right";
                    else if (vy === -1 && vx === 1) direction = "up-right";
                    else if (vy === -1 && vx === -1) direction = "up-left";
                    else if (vy === 1 && vx === -1) direction = "down-left";

                    found.push({
                        word: target,
                        start: [y, x],
                        direction
                    });
                }
            });
        }
    }

    return found;
}



const findXmas = (grid: string[][]) => {

     // map 
     const height = grid.length;
     const width = grid[0].length;
 
     // save
     const found: { word: string, start: [number, number], direction: string }[] = [];
     const target = "MAS";

     const isValid = (y: number, x: number) => 
        y >= 0 && y < height && x >= 0 && x < width;

     function isIntersectionOfMAS( y: number, x: number): boolean {
        if (grid[y][x] !== 'A') return false;
    
        let masCount = 0;
        
        diagonalVectors.forEach(([vy, vx]) => {
            if (!isValid(y - vy, x - vx) || grid[y - vy][x - vx] !== 'M') return;
            
            if (!isValid(y + vy, x + vx) || grid[y + vy][x + vx] !== 'S') return;
            
            masCount++;
        });
    
        return masCount >= 2;
    }

    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(isIntersectionOfMAS(y, x)){
                i++;
            }
        }
    }
    return i;

}

export const mainDayFour = async () => {
    const input = await fetchInput(4);
    const grid=stringToGrid(input)
    const sum2 = findXmas(grid);
    return 'Hello World! \n' + '\n' + sum2;
}

