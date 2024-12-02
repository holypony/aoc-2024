import express from 'express';
import dotenv from 'dotenv';
import { mainDayTwo } from './Days/day-2';
import { main } from './Days/day-1';
const app = express();
const port = 3000;


dotenv.config();
app.get('/', async (req, res) => {
  const text = await main();
  res.send(text);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});