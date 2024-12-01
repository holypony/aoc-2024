import express from 'express';
const app = express();
const port = 3000;
import dotenv from 'dotenv';
import { main } from './Days/day-1';

dotenv.config();
app.get('/', async (req, res) => {
    const text = await main()

  res.send('Hello World!1');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});