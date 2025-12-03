import { fetchInput } from "../Utils/fetch-input";

function prepareInput(str:string){
  return str.split("\n");
}

function countDigit(str, digit) {
  return str.split('').filter(char => char === String(digit)).length;
}

function indexsOfDigit(str, digit) {
  const indices = [];
  const search = String(digit);

  for (let i = 0; i < str.length; i++) {
    if (str[i] === search) {
      indices.push(i);
    }
  }

  return indices;
}

function examLine(line:string){

  // define first biggest
  let biggestFirst = 0;
  let biggestSecond = 0;
  for(let i = 0; i < 10; i++){
      const strDigit = i.toString();
      if(!line.includes(strDigit)) continue;
      // find quantity of this digit in line

      if(countDigit(line,i) === 1 && line.lastIndexOf(strDigit) === line.length - 1 ) continue;


      biggestFirst = i;

  }

  const indexOfFirstBiggest = line.indexOf(biggestFirst.toString());
  const newLineStartsFromBiggest = line.substring(indexOfFirstBiggest+1);
  if(indexOfFirstBiggest === line.length - 2) return Number(biggestFirst + line[line.length - 1])
  console.log(newLineStartsFromBiggest)
  for(let i = 0; i < 10; i++){
    const strDigit = i.toString();
    if(!newLineStartsFromBiggest.includes(strDigit)) continue;
    biggestSecond = i;

  }
  const result = Number(biggestFirst.toString() + biggestSecond.toString())
  console.log(result)
  return result;

}



function examLineTwo(line:string){
  let biggestNumber = 0;
  let biggestFirst = 0;
  for(let i = 0; i < 10; i++){
    const strDigit = i.toString();
    if(!line.includes(strDigit)) continue;
    biggestFirst = i;
    const arrWithIndexes = indexsOfDigit(line,i);

    if(arrWithIndexes){

      for(let j = 0; j < arrWithIndexes.length; j++){
        const newLineStartsFromBiggest = line.substring(j);
        if(newLineStartsFromBiggest.length < 12) continue;



      }
    }
  }
  return biggestNumber;
}

function checkNextTwelve(str, startIndex) {
  if (startIndex + 12 > str.length) {
    return 0;
  }
  return str.substring(startIndex, startIndex + 12);
}

const testInput = '987654321111111\n' +
  '811111111111119\n' +
  '234234234234278\n' +
  '818181911112111'

export async function mainThree(){
  const input = await fetchInput(3)
  const data = prepareInput(testInput);
  //let result = examLineTwo(data[0]);
  // for(let i = 0; i < data.length; i++){
  //   console.log(data[i]);
  //
  //   result+=examLine(data[i])
  // }

  let result:number = 0;

  for(let i = 0; i < data.length; i++){
    const str = data[i]
    console.log(str);
    const newLineResult = examLineTwo(data[i]);
    console.log("new",newLineResult);

    result = Number(result) + Number(newLineResult);
  }



  return result;
}
