const fetchInputOfDayOne = async () =>{

    const response = await fetch('https://adventofcode.com/2024/day/1/input', {
        headers: {
            'Cookie': `session=${process.env.DAY_ONE_SESSION_COOKIE ?? ""}`
        }
    });
    const text = await response.text();
    return text
}

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

export const main = async () => {
    const input = await fetchInputOfDayOne();
    const parsedInput = parseInputOfDayOne(input);


    const sortedLeftColumn = sortArray(parsedInput.leftColumn);
    const sortedRightColumn = sortArray(parsedInput.rightColumn);

    //const differences = countDifference(sortedLeftColumn, sortedRightColumn);
    //console.log(differences);

    const similarityScore = findSimilarityScore(sortedLeftColumn, sortedRightColumn);
    console.log(similarityScore);
}

const findSimilarityScore = (leftColumn: number[], rightColumn: number[]) => {
    let similarityScore = 0;
    
    leftColumn.forEach(leftNum => {
        const appearances = rightColumn.filter(rightNum => rightNum === leftNum).length;
        similarityScore += leftNum * appearances;
    });
    
    return similarityScore;
}