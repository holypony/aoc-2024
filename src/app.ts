import express from 'express';
import dotenv from 'dotenv';
import { mainDayTen } from './Days/day-10';



const app = express();
const port = 3000;


dotenv.config();
app.get('/', async (req, res) => {

  const answer = await mainDayTen();
  res.send(answer.toString());

});

app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});