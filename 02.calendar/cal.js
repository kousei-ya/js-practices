#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const today = new Date();
const year = argv.y === undefined ? today.getFullYear() : argv.y;
const month = argv.m=== undefined ? today.getMonth() + 1 : argv.m;

const firstDay = new Date(year, month -1 );
const lastDay = new Date(year, month, 0);

const monthString = new Intl.DateTimeFormat("en", { month: "long" }).format(
  firstDay,
);

const leftPadding = Math.floor(
  (20 - (monthString.length + String(year).length + 1)) / 2,
);

console.log(
  `${" ".repeat(leftPadding)}${monthString} ${year}`
);

console.log("Su Mo Tu We Th Fr Sa");

for (let offset = 0; offset < firstDay.getDay(); offset++) {
  process.stdout.write("   ");
}

for (let currentDate = firstDay.getDate(); currentDate <= lastDay.getDate(); currentDate++) {
  process.stdout.write(String(currentDate).padStart(2, " "));
  process.stdout.write(" ");
  if ((firstDay.getDay() + currentDate) % 7 === 0) {
    console.log();
  }
}
console.log();
