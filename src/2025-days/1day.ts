import { fetchInput } from "../Utils/fetch-input";

export async function mainOne() {
  const res = await fetchInput(1)
  const arr = prepareInput(res);
  const result = workOnSequence(arr);

  return result
}

function prepareInput(str:string){

  const arr = str.split("\n");
  for(let t = 0; t < arr.length; t++){
    arr[t].trim();
  }
  return arr;
}


function dialCalc(currentNumber:number, newNumber:number){
  const max = 100;
  const newSum = currentNumber + newNumber;

  let crossings = 0;

  if (newNumber > 0) {
    // Moving forward (R): count how many times we pass through 0
    // We hit 0 at positions 100, 200, 300, etc. from our starting point
    crossings = Math.floor((currentNumber + newNumber) / max);
  } else if (newNumber < 0) {
    // Moving backward (L): count how many times we pass through 0
    const distance = Math.abs(newNumber);
    if (currentNumber === 0) {
      // Special case: starting at 0, we only hit it again after going full circles
      crossings = Math.floor(distance / max);
    } else if (distance >= currentNumber) {
      // We hit 0 after `currentNumber` steps, then every 100 steps after that
      crossings = 1 + Math.floor((distance - currentNumber) / max);
    }
  }

  const newPosition = ((newSum % max) + max) % max;

  return { newPosition, crossings };
}


function workOnSequence(arr: string[]) {
  let currentNumber = 50;
  let zeroCount = 0;

  for(let t = 0; t < arr.length; t++){
    const letter = arr[t][0];
    const number = Number(arr[t].trim().slice(1));

    const movement = letter === 'R' ? number : -number;
    const result = dialCalc(currentNumber, movement);

    currentNumber = result.newPosition;
    zeroCount += result.crossings;
  }

  return zeroCount;
}
