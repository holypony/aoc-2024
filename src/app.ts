import express from 'express';
import dotenv from 'dotenv';
import { mainDayTwo } from './Days/day-2';
import { main } from './Days/day-1';
import { mainDayThree } from './Days/day-3';
const app = express();
const port = 3000;


dotenv.config();
app.get('/', async (req, res) => {
  const answer = await mainDayThree();
  res.send(answer);
});

app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});