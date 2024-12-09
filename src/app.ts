import express from 'express';
import dotenv from 'dotenv';
import { mainDaySeven } from './Days/day-7';
import { mainDayEight } from './Days/day-8';
import { mainDayNine } from './Days/day-9';
const app = express();
const port = 3000;


dotenv.config();
app.get('/', async (req, res) => {
  const answer =  await mainDayNine();
  res.send(answer.toString());
});

app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});