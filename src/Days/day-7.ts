import { fetchInput } from "../Utils/fetch-input";

type Equation = { target: number; numbers: number[] };

export const mainDaySeven = async () => {
    const input = await fetchInput(7);

    const result = calculateEquations(input);
    console.log("result", result);
    return "result";
}

export const calculateEquations =  (input:string) => {
    
    const equations: Equation[] = input
      .trim()
      .split("\n")
      .map((line) => {
        const [target, nums] = line.split(": ");
        return { target: +target, numbers: nums.split(" ").map(Number) };
      });
  
    const checkEquation = (nums: number[], target: number, ops: string[]): boolean => {



      const calc = (value: number, num: number, op: string): number =>
        op === "+"
          ? value + num
          : op === "*"
          ? value * num
          : +(value.toString() + num);
    //
      return nums
        .slice(1)
        .reduce(
          (results, num) => {
            const newResults: number[] = [];
            results.forEach((val) =>
              ops.forEach((op) => newResults.push(calc(val, num, op)))
            );
            return newResults;
          },
          [nums[0]]
        )
        .includes(target);
    };
  
    const calculate = (ops: string[]): number =>
      equations.reduce(
        (sum, { target, numbers }) =>
          sum + (checkEquation(numbers, target, ops) ? target : 0),
        0
      );
  
  return calculate(["+", "*", "||"]);
      
  };
  