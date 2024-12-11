import { fetchInput } from "../Utils/fetch-input";

export const mainDayEleven = async () => {
  const input = await fetchInput(11);
//  console.log(input);
    const test = '125 17'
    const stones = input.split(' ').map(num => parseInt(num));

    // let newStones = stones;
    // for(let i = 0; i < 75; i++){
    //     newStones = processStones(newStones);
    //     console.log(i);
    // }

    const res = createStones(input);
    
    console.log(res);
  return res;
};

const processStones = (stones: number[]) => {
    const result = []; 
        stones.forEach(stone => {
            if(stone === 0){
                result.push(1);
            }
            else if(stone.toString().length % 2 === 0){
                const half = stone.toString().length / 2;
                const left = parseInt(stone.toString().slice(0, half));
                const right = parseInt(stone.toString().slice(half));
                result.push(left);
                result.push(right);
            }
            else{
                result.push(stone * 2024);
            }
        })
        
    return result;
}

// If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
// If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
// If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.


const changeStones = (stones: Map<string, number>, steps: number) => {
    for (let step = 0; step < steps; step++) {
        const newStones = new Map<string, number>();
        
        stones.forEach((count, stone) => {
            if (parseInt(stone) === 0) {
                newStones.set('1', (newStones.get('1') || 0) + count);
            }
            else if (stone.length % 2 === 0) {
                const left = parseInt(stone.slice(0, stone.length / 2)).toString();
                const right = parseInt(stone.slice(stone.length / 2)).toString();
                newStones.set(left, (newStones.get(left) || 0) + count);
                newStones.set(right, (newStones.get(right) || 0) + count);
            } else {
                const newValue = (parseInt(stone) * 2024).toString();
                newStones.set(newValue, (newStones.get(newValue) || 0) + count);
            }
        });
        console.log(Object.fromEntries(newStones));
        stones = newStones;
    }

    return stones;
}

const createStones = (input: string) => {
    const stones = input.split(' ').map(num => parseInt(num));
    const stoneCounts = new Map<string, number>();

    stones.forEach(stone => {
        const stoneStr = stone.toString();
        stoneCounts.set(stoneStr, (stoneCounts.get(stoneStr) || 0) + 1);
    });
    
    return Array.from(changeStones(stoneCounts, 75).values())
        .reduce((sum, num) => sum + num, 0);
};