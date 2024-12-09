import { fetchInput } from "../Utils/fetch-input";


const usedIndexes = new Map<string, number>();
const parseInput = (input: string) => {

    let result = [];
    let currentNumber = 0;
    for (let i = 0; i < input.length; i++) {
        if (i % 2 === 1) {
            for (let j = 0; j < parseInt(input[i]); j++) {
                result.push(".");
            }
        }
        else {
            let count = 0;
            for (let j = 0; j < parseInt(input[i]); j++) {
                result.push(currentNumber.toString());
                count++;
            }
            usedIndexes.set(currentNumber.toString(), count);
            currentNumber++;
        }
    }
    return result;

}



const compressInput = (input: any[]) => {
    const result = [...input]; 
    let endIndex = result.length - 1;

    for (let i = 0; i < result.length; i++) {
        if (result[i] === ".") {
           
            while (endIndex > i && (result[endIndex] === "." || result[endIndex] === undefined)) {
                endIndex--;
            }
            
            if (endIndex > i) {
                result[i] = result[endIndex];
                result[endIndex] = undefined; 
                endIndex--;
            }
        }
    }

    
    return result.filter(x => x !== undefined && x !== ".");
}



const checkSum = (input: any[]) => {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        if(input[i] !== "."){
            sum += input[i] * i;
        }
    }
    return sum;
}

export const mainDayNine = async () => {
    const input = await fetchInput(9);
    console.log(input);
    const parsedInput = parseInput("2333133121414131402");
    const result = processBlocks(input);
    console.log(result);
    return "linkList";
}





const processBlocks = (input: string): number => {
    const blocks: string[] = [];
    let isBlock = true;
    let fileId = 0;
    
    for (const numChar of input) {  
        const count = parseInt(numChar, 10);
       

        const symbol = isBlock ? String(fileId) : '.';
        for (let i = 0; i < count; i++) {
            blocks.push(symbol);
        }
        
        if (isBlock) fileId++;
        isBlock = !isBlock;
    }
    
    for (let currentFile = fileId - 1; currentFile >= 0; currentFile--) {
        const filePositions = getFilePositions(blocks, currentFile);
        const newPos = getLeftPosition(blocks, filePositions);
        if (newPos !== -1) {
            moveBlocks(blocks, filePositions, newPos);
        }
    }
    
    return checkSum2(blocks);
}

const getFilePositions = (blocks: string[], fileId: number): number[] => {
    const positions: number[] = [];
    const target = String(fileId);
    
    blocks.forEach((block, index) => {
        if (block === target) {
            positions.push(index);
        }
    });
    
    return positions;
}

const getLeftPosition = (blocks: string[], blockPositions: number[]): number => {
    if (blockPositions.length === 0) return -1;
    
    const requiredLength = blockPositions.length;
    let freeStart = -1;
    let freeLength = 0;
    
    for (let i = 0; i < blockPositions[0]; i++) {
        if (blocks[i] !== '.') {
            freeStart = -1;
            freeLength = 0;
            continue;
        }
        
        if (freeStart === -1) {
            freeStart = i;
        }
        freeLength++;
        
        if (freeLength === requiredLength) {
            return freeStart;
        }
    }
    
    return -1;
}

const moveBlocks = (blocks: string[], oldPositions: number[], newStart: number): void => {
    const fileId = blocks[oldPositions[0]];
    oldPositions.forEach(pos => {
        blocks[pos] = '.';
    });
    oldPositions.forEach((_, index) => {
        blocks[newStart + index] = fileId;
    });
}

const checkSum2 = (blocks: string[]): number => {
    return blocks.reduce((score, block, position) => {
        if (block !== '.') {
            return score + position * parseInt(block, 10);
        }
        return score;
    }, 0);
}

