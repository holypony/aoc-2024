import { fetchInput } from "../Utils/fetch-input";

const test = "89010123\n78121874\n87430965\n96549874\n45678903\n32019012\n01329801\n10456732";
const easyTest = '...0...\n...1...\n...2...\n6543456\n7.....7\n8.....8\n9.....9';
const easyTest2='..90..9\n...1.98\n...2..7\n6543456\n765.987\n876....\n987....';


const makeGridFromMultilineString =
    (input: string) => input.split("\n").map(st => st.trim()).map(v => v.split(""));



let globalCount = 0;
export const mainDayTen = async () => {
    globalCount = 0;
    const input = await fetchInput(10);
    const grid = makeGridFromMultilineString(input);
    const map = generateMap(grid);
    console.log("START RUNNING | start cells: ", startCells.size);

    for(const cell of startCells.values()){
        move(map, cell, cell);
    }
    let count = 0;
    for(const cell of finishCells.values()){
        // count how many | in the string
        count += cell.split("|").length - 1;
    }

    console.log("FINISH | ", count);

    return globalCount;
}


type Cell = {
    x: number;
    y: number;
    value: string;
    left: Cell | null;
    right: Cell | null;
    up: Cell | null;
    down: Cell | null;
}

const generateMap = (grid: string[][]) => {

    // create first cell 
    const firstCell = {x: 0, y: 0, value: grid[0][0], left: null, right: null, up: null, down: null};
    map.set(`0:0`, firstCell);

    for(let y = 0; y < grid.length; y++){
        for(let x = 0; x < grid[y].length; x++){
            if(x === 0 && y === 0) continue;
            const cell = {x, y, value: grid[y][x], left: null, right: null, up: null, down: null};
            map.set(`${x}:${y}`, cell);
            
            if(cell.value === "0"){
                startCells.set(`${x}:${y}`, cell);
            }

            if(cell.value === "9"){
                finishCells.set(`${x}:${y}`, " ");
            }
        }
    }


    for(const cell of map.values()){
        cell.left = getLeftCell(cell);
        cell.right = getRightCell(cell);
        cell.up = getUpCell(cell);
        cell.down = getDownCell(cell);
    }

    console.log("MAP GENERATED ", map.size);
    return map;
}

const map = new Map<string, Cell>();
const trailheads = new Set<string>();
const startCells = new Map<string, Cell>();
// cor of nine and 0 from the start cell
const finishCells = new Map<string, string>();


const move = (map:Map<string, Cell>, startCell: Cell, currentCell: Cell, trail:  string | null = null) => {
        
        if(!trail){
            trail = `|${startCell.x}:${startCell.y}`;
        }

        if(currentCell.value === "9"){
            


            trailheads.add(trail);
            visualizeCoordinates(trail);
            console.log(trail.split("|").map(v => v.split(":")[0]).join(""));

            
            globalCount++;
            return;
        }

        const nextValue = (parseInt(currentCell.value)+1).toString();

        if(currentCell.right?.value === nextValue){
            move(map, startCell, currentCell.right,trail);
        }
        if(currentCell.left?.value === nextValue){
            move(map, startCell, currentCell.left,trail);
        }
        if(currentCell.up?.value === nextValue){
            move(map, startCell, currentCell.up,trail);
        }
        if(currentCell.down?.value === nextValue){
            move(map, startCell, currentCell.down,trail);
        }
        return;
}




            
// get left cell
const getLeftCell = (cell: Cell) => {
    return map.get(`${cell.x - 1}:${cell.y}`) ?? null;
}

// get right cell
const getRightCell = (cell: Cell) => {
    return map.get(`${cell.x + 1}:${cell.y}`) ?? null;
}

// get up cell
const getUpCell = (cell: Cell) => {
    return map.get(`${cell.x}:${cell.y - 1}`) ?? null;
}

// get down cell
const getDownCell = (cell: Cell) => {
    return map.get(`${cell.x}:${cell.y + 1}`) ?? null;
}

function visualizeCoordinates(coordString) {

    const colors = {
        start: '\x1b[32m',    // Green
        end: '\x1b[31m',      // Red
        normal: '\x1b[34m',   // Blue
        reset: '\x1b[0m'      // Reset color
    };
    // Parse the coordinate string
    const coords = coordString.split('|')
        .filter(c => c) // Remove empty strings
        .map(pair => {
            const [x, y] = pair.split(':').map(Number);
            return { x, y };
        });
    
    // Find the dimensions of our grid
    const maxX = Math.max(...coords.map(c => c.x)) + 1;
    const maxY = Math.max(...coords.map(c => c.y)) + 1;
    
    // Create the grid
    const grid = Array(maxY).fill(null)
        .map(() => Array(maxX).fill(' '));
    
    // Fill in the coordinates
    coords.forEach((coord, index) => {
        let symbol;
        if (index === 0) {
            symbol = `${colors.start}■${colors.reset}`; // Start point
        } else if (index === coords.length - 1) {
            symbol = `${colors.end}■${colors.reset}`;   // End point
        } else {
            symbol = `${colors.normal}■${colors.reset}`; // Middle points
        }
        grid[coord.y][coord.x] = symbol;
    });
    
    // Print the grid
    console.log('\nVisualization:');
    // Print column numbers
    console.log('  ' + [...Array(maxX)].map((_, i) => i).join(' '));
    // Print the grid with row numbers
    grid.forEach((row, i) => {
        console.log(i + ' ' + row.join(' '));
    });
}