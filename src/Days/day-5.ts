import { fetchInput } from "../Utils/fetch-input";

const parseInput = (input: string): [string[], string[]] => {
    const [rules, sequences] = input.split(/\n\s*\n/);
    return [rules.split('\n'), sequences.split('\n')];
};

const buildRuleMap = (rules: string[]): Map<number, Set<number>> => {

    const ruleMap = new Map<number, Set<number>>();
    //
    rules.forEach(rule => {
        const [before, after] = rule.split('|').map(Number);
        if (!ruleMap.has(before)) {
            ruleMap.set(before, new Set());
        }
        ruleMap.get(before)?.add(after);
    });
    return ruleMap;
};

const sumOfMiddleElements = (sequences: number[][]): number => {
    return sequences.reduce((sum, seq) => {
        if (seq.length % 2 !== 0) {
            const middleIndex = Math.floor(seq.length / 2);
            return sum + seq[middleIndex];
        }
        return sum;
    }, 0);
};




const isValidSequence = (seq: number[], ruleMap: Map<number, Set<number>>): boolean => {
    for (let i = 0; i < seq.length; i++) {
        for (let j = i + 1; j < seq.length; j++) {
            const before = seq[i];
            const after = seq[j];
            if (ruleMap.get(after)?.has(before)) {
                return false;
            }
        }
    }
    return true;
};


const fixSequence = (seq: number[], ruleMap: Map<number, Set<number>>): number[] => {
    console.log("seq",seq);
    const sequences = new Map<number, number>();
    
    seq.forEach(num => sequences.set(num, 0));


    seq.forEach(before => {
        const afterSet = ruleMap.get(before);

        if (afterSet) {
            afterSet.forEach(after => {
                if (seq.includes(after)) {
                    sequences.set(after, (sequences.get(after) || 0) + 1);
                }
            });
        }

    });
    

    const result: number[] = [];

    const available = new Set(seq.filter(num => sequences.get(num) === 0));



    while (available.size > 0) {
        const current = Math.min(...Array.from(available));
        available.delete(current);
        result.push(current);
        const afterSet = ruleMap.get(current);
        if (afterSet) {
            afterSet.forEach(after => {
                if (seq.includes(after)) {
                    const newCount = (sequences.get(after) || 0) - 1;
                    sequences.set(after, newCount);
                    if (newCount === 0) {
                        available.add(after);
                    }
                }
            });
        }
    }
    console.log("result",result);

    return result;
};

export const mainDayFive = async () => {
    const input = await fetchInput(5);
    const [rules, sequences] = parseInput(input);
    const ruleMap = buildRuleMap(rules);

    const sequenceArrays = sequences.map(seq => seq.split(',').map(Number));
    const validSequences = sequenceArrays.filter(seq => isValidSequence(seq, ruleMap));
    const invalidSequences = sequenceArrays.filter(seq => !isValidSequence(seq, ruleMap));
    const fixedSequences = invalidSequences.map(seq => fixSequence(seq, ruleMap));

    const sumOfValidMiddleElements = sumOfMiddleElements(validSequences);
    const sumOfFixedMiddleElements = sumOfMiddleElements(fixedSequences);

    return `${sumOfValidMiddleElements},fixed  ${sumOfFixedMiddleElements}`;
};

