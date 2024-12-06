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

const firstDay = new Date(year, month);
const lastDay = new Date(year, month, 0);
let targetDay = new Date(year, month - 1);

const monthAlphabet = new Intl.DateTimeFormat("en", { month: "long" }).format(
  targetDay,
);

const leftBrank = Math.floor(
  (20 - (monthAlphabet.length + String(year).length + 1)) / 2,
);
const rightBlank =
  20 - (leftBrank + monthAlphabet.length + String(year).length);

console.log(
  " ".repeat(leftBrank) + monthAlphabet + " " + year + " ".repeat(rightBlank),
);

console.log("Su Mo Tu We Th Fr Sa");

for (let blank = 0; blank < targetDay.getDay(); blank++) {
  process.stdout.write("   ");
}

for (let num = firstDay.getDate(); num <= lastDay.getDate(); num++) {
  process.stdout.write(String(num).padStart(2, " "));
  process.stdout.write(" ");
  if ((targetDay.getDay() + num) % 7 === 0) {
    console.log();
  }
}
console.log();
