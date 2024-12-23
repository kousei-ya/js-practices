import sqlite3 from "sqlite3";
import { promisifyDatabase } from "./base_functions.js";

const db = new sqlite3.Database(":memory:");
const pdb = promisifyDatabase(db);

async function main() {
  await pdb.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  console.log("Table create!");

  const result = await pdb.run("INSERT INTO books (title) VALUES (?)", [
    "SampleBook",
  ]);
  console.log(`ID: ${result.lastID}`);

  const rows = await pdb.all("SELECT id, title FROM books");
  console.log("Books:", rows);

  await pdb.run("DROP TABLE books");
  console.log("Table dropped!");

  await pdb.close();
  console.log("Database closed!");
}

main();
