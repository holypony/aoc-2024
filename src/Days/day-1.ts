import { fetchInput } from "../Utils/fetch-input";


const parseInputOfDayOne = (input: string) => {
    const lines = input.split('\n');
    const leftColumn: number[] = [];
    const rightColumn: number[] = [];
    
    lines.forEach(line => {
        const [left, right] = line.trim().split(/\s+/);
        if (left && right) {
            leftColumn.push(Number(left));
            rightColumn.push(Number(right));
        }
    });

    return { leftColumn, rightColumn };
}

const sortArray = (array: number[]) => {
    //by ascending order
    return array.sort((a, b) => a - b);
}

const countDifference = (leftColumn: number[], rightColumn: number[]) => {
    let count = 0;
    for (let i = 0; i < leftColumn.length; i++) {
        count += Math.abs(leftColumn[i] - rightColumn[i]);
    }
    return count;
}

const findSimilarityScore = (leftColumn: number[], rightColumn: number[]) => {
    const rightFrequency = new Map();
    rightColumn.forEach(num => {
        rightFrequency.set(num, (rightFrequency.get(num) || 0) + 1);
    });
    
    let similarityScore = 0;
    leftColumn.forEach(leftNum => {
        const appearances = rightFrequency.get(leftNum) || 0;
        similarityScore += leftNum * appearances;
    });
    
    return similarityScore;
}

export const main = async () => {
    const input = await fetchInput(1);
    const parsedInput = parseInputOfDayOne(input);

    const sortedLeftColumn = sortArray(parsedInput.leftColumn);
    const sortedRightColumn = sortArray(parsedInput.rightColumn);

    //const differences = countDifference(sortedLeftColumn, sortedRightColumn);
    //console.log(differences);

    const similarityScore = findSimilarityScore(sortedLeftColumn, sortedRightColumn);
    return 'Hello World! \n' + similarityScore;
}

