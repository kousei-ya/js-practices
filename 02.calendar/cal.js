#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const today = new Date();
let year;
let month;

if (argv.y === undefined) {
  year = today.getFullYear();
} else {
  year = argv.y;
}

if (argv.m === undefined) {
  month = today.getMonth() + 1;
} else {
  month = argv.m;
}

const first_day = new Date(year, month).getDate();
const last_day = new Date(year, month, 0).getDate();
let target_day = new Date(year, month - 1);
let day_of_week = target_day.getDay();

const month_alp = new Intl.DateTimeFormat("en", { month: "long" }).format(
  target_day,
);

const left_blank = Math.floor(
  (20 - (month_alp.length + String(year).length + 1)) / 2,
);
const right_blank = 20 - (left_blank + month_alp.length + String(year).length);

console.log(
  " ".repeat(left_blank) + month_alp + " " + year + " ".repeat(right_blank),
);

console.log("Su Mo Tu We Th Fr Sa");

for (let blank = 0; blank < day_of_week; blank++) {
  process.stdout.write("   ");
}

for (let num = first_day; num <= last_day; num++) {
  process.stdout.write(String(num).padStart(2, " "));
  process.stdout.write(" ");
  if ((day_of_week + num) % 7 === 0) {
    console.log();
  }
}
console.log();
