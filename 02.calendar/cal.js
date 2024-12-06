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

const firstDay = new Date(year, month).getDate();
const lastDay = new Date(year, month, 0).getDate();
let targetDay = new Date(year, month - 1);
let dayOfWeek = targetDay.getDay();

const month_alp = new Intl.DateTimeFormat("en", { month: "long" }).format(
  targetDay,
);

const leftBrank = Math.floor(
  (20 - (month_alp.length + String(year).length + 1)) / 2,
);
const rightBlank = 20 - (leftBrank + month_alp.length + String(year).length);

console.log(
  " ".repeat(leftBrank) + month_alp + " " + year + " ".repeat(rightBlank),
);

console.log("Su Mo Tu We Th Fr Sa");

for (let blank = 0; blank < dayOfWeek; blank++) {
  process.stdout.write("   ");
}

for (let num = firstDay; num <= lastDay; num++) {
  process.stdout.write(String(num).padStart(2, " "));
  process.stdout.write(" ");
  if ((dayOfWeek + num) % 7 === 0) {
    console.log();
  }
}
console.log();
