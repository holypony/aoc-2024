import { fetchInput } from "../Utils/fetch-input";

const test =
  "Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400\n\nButton A: X+26, Y+66\nButton B: X+67, Y+21\nPrize: X=12748, Y=12176\n\nButton A: X+17, Y+86\nButton B: X+84, Y+37\nPrize: X=7870, Y=6450\n\nButton A: X+69, Y+23\nButton B: X+27, Y+71\nPrize: X=18641, Y=10279";

interface ButtonCoordinates {
  buttonA: { x: number; y: number };
  buttonB: { x: number; y: number };
  prize: { x: number; y: number };
}

const aValue = 3;
const bValue = 1;

let sum = 0;

export const mainDayThirteen = async () => {
  const input = await fetchInput(13);

  const games = parseGames(input);
  console.log(games);

  for (const game of games) {
    calculate2(game);
  }

  return sum;
};

const parseGames = (input: string): ButtonCoordinates[] => {
  const games: ButtonCoordinates[] = [];
  const lines = input.split("\n\n");

  for (const game of lines) {
    if (!game.trim()) continue;

    const coordinates: ButtonCoordinates = {
      buttonA: { x: 0, y: 0 },
      buttonB: { x: 0, y: 0 },
      prize: { x: 0, y: 0 },
    };

    const matches = game.match(/Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/);

    if (matches) {
      coordinates.buttonA = { x: parseInt(matches[1]), y: parseInt(matches[2]) };
      coordinates.buttonB = { x: parseInt(matches[3]), y: parseInt(matches[4]) };
      coordinates.prize = { x: parseInt(matches[5]), y: parseInt(matches[6]) };
      games.push(coordinates);
    }
  }

  return games;
};

const calculate = (game: ButtonCoordinates) => {
  const a = game.buttonA;
  const b = game.buttonB;
  const prize = game.prize;

  const determinant = a.x * b.y - b.x * a.y;

  const pressA = (prize.x * b.y - b.x * prize.y) / determinant;
  const pressB = (a.x * prize.y - prize.x * a.y) / determinant;
  if (pressA > 100 || pressB > 100 || !Number.isInteger(pressA) || !Number.isInteger(pressB)) return;
  sum += pressA * aValue + pressB * bValue;
  console.log(pressA, pressB);
};

const calculate2 = (game: ButtonCoordinates) => {
  const a = game.buttonA;
  const b = game.buttonB;
  const prize = game.prize;

  prize.x = prize.x + 10000000000000;
  prize.y = prize.y + 10000000000000;

  const determinant = a.x * b.y - b.x * a.y;

  const pressA = (prize.x * b.y - b.x * prize.y) / determinant;
  const pressB = (a.x * prize.y - prize.x * a.y) / determinant;
  if (!Number.isInteger(pressA) || !Number.isInteger(pressB)) return;
  sum += pressA * aValue + pressB * bValue;
  console.log(pressA, pressB);
};
