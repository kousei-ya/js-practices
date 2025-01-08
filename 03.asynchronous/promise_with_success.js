import sqlite3 from "sqlite3";
import { promisifyDatabase } from "./base_functions.js";

const db = new sqlite3.Database(":memory:");
const pdb = promisifyDatabase(db);

function main() {
  pdb
    .run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    )
    .then(() => {
      console.log("books' table was successfully created.");
      return pdb.run("INSERT INTO books (title) VALUES (?)", ["SampleBook"]);
    })
    .then((result) => {
      console.log(`ID:${result.lastID}`);
      return pdb.all("SELECT id, title FROM books");
    })
    .then((rows) => {
      console.log("Books:", rows);
      return pdb.run("DROP TABLE books");
    })
    .then(() => {
      console.log("The 'books' table was successfully dropped.");
      return pdb.close();
    })
    .then(() => {
      console.log("The database connection has been successfully closed.");
    });
}

main();
