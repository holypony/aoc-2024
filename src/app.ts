import express from "express";
import dotenv from "dotenv";
import { mainDayTen } from "./Days/day-10";
import { mainDayEleven } from "./Days/day-11";

import { mainDayTwelve } from "./Days/day-12";
import { mainDayThirteen } from "./Days/day-13";
import { mainDayFourteen } from "./Days/day-14";
import { mainDayFifteen } from "./Days/day-15";
import { mainDaySixteen } from "./Days/day-16";
import { mainOne } from "./2025-days/1day";
import { mainTwo } from "./2025-days/2day";
import { mainThree } from "./2025-days/3day";

const app = express();
const port = 3000;

dotenv.config();
app.get("/", async (req, res) => {
  const answer = await mainThree();
  res.send(answer.toString());
});

app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});
