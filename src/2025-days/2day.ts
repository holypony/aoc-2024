import { fetchInput } from "../Utils/fetch-input";

function prepareInput(input:string){
  const result = input.trim().split(',');


  //const str = '11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862'

  return result
}

function hasRepeatedPattern(num) {
  const str = String(num);
  //if(str.length % 2 !== 0 ) return false;
  return /^(.+)\1+$/.test(String(num));


}
// 16050773417
// 12586854255 - new
function checkRange(rangeStr:string){

  const rangeArr = rangeStr.split("-");

  const startNumber = Number(rangeArr[0]);
  const finishNumber = Number(rangeArr[1]);

  let result = 0 ;
  for (let i = startNumber; i <= finishNumber; i++) {
    if (hasRepeatedPattern(i)) {
      console.log(i, "range",startNumber,finishNumber)
      result+=i
    }

  }
  return result;
}
export async function mainTwo(){

  const input = await fetchInput(2)
  const idRangesArray = prepareInput(input)
  let result = 0;
  for (let i = 0; i <= idRangesArray.length - 1; i++) {
    const invalidIds = checkRange(idRangesArray[i]);
    result+=invalidIds;
  }

  return result;
}

