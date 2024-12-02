import { fetchInput } from "../Utils/fetch-input";

const parseInput = (input: string) => {
    const lines = input.split('\n');
    const arraysOfNumbers: number[][] = [];
    
    lines.forEach(line => {
        const numbers = line.trim().split(/\s+/).map(Number);
        if (numbers.length > 0) {
            arraysOfNumbers.push(numbers);
        }
    });

    return arraysOfNumbers;
}

const isValidSequence = (numbers: number[]): boolean => {
    if (numbers.length < 2) return false;
    
    const isIncreasing = numbers[1] > numbers[0];
    
    for (let i = 1; i < numbers.length; i++) {
        const diff = Math.abs(numbers[i] - numbers[i - 1]);
        
        if (diff < 1 || diff > 3) {
            return false;
        }
        
        if (isIncreasing && numbers[i] <= numbers[i - 1]) {
            return false;
        } else if (!isIncreasing && numbers[i] >= numbers[i - 1]) {
            return false;
        }
    }
    
    return true;
}

const isValidSequencePartTwo = (numbers: number[]): boolean => {
    if (isValidSequence(numbers)) return true;
    
    for (let i = 0; i < numbers.length; i++) {
        const modifiedSequence = [...numbers.slice(0, i), ...numbers.slice(i + 1)];
        if (isValidSequence(modifiedSequence)) {
            return true;
        }
    }
    
    return false;
}

const calculateScore = (arraysOfNumbers: number[][]) => {
    let score = 0;
    arraysOfNumbers.forEach(array => {
        if (isValidSequencePartTwo(array)) {
            score += 1;
        }
    });
    return score;
}

export const mainDayTwo = async () => {
    const input = await fetchInput(2);
    const parsedInput = parseInput(input);
    const score = calculateScore(parsedInput);

    return 'Hello World! \n' + score;
}