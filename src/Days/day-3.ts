import { fetchInput } from "../Utils/fetch-input";

function sumMultiplications(text: string): number {
    const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
    
    const matches = text.matchAll(pattern);
    
    const sum = Array.from(matches).reduce((acc, match) => {
        const [_, num1, num2] = match;
        return acc + parseInt(num1) * parseInt(num2);
    }, 0);
    
    return sum;
}

function sumMultiplicationsExtended(text: string): number {
    let sum = 0;
    const mulPattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
    const allMatches = text.matchAll(mulPattern);

    for (const match of allMatches) {
        const [, num1, num2] = match;
        const indexOfCurrentMatch = match.index!;
        
        const textBeforeMul = text.slice(0, indexOfCurrentMatch);
        
        const lastDoIndex = textBeforeMul.lastIndexOf('do()');
        const lastDontIndex = textBeforeMul.lastIndexOf('don\'t()');

        if (lastDoIndex === -1 && lastDontIndex === -1) {
            sum += parseInt(num1) * parseInt(num2);
        } else if (lastDoIndex > lastDontIndex) {
            sum += parseInt(num1) * parseInt(num2);
        }
    }
    
    return sum;
}

export const mainDayThree = async () => {
    const input = await fetchInput(3);
    const sum = sumMultiplicationsExtended(input)
    return 'Hello World! \n' + sum;
}