import sqlite3 from "sqlite3";
import { promisifyDatabase } from "./sqlite_promisified.js";

function main() {
  const db = new sqlite3.Database(":memory:");
  const promisifiedDb = promisifyDatabase(db);

  promisifiedDb
    .run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    )
    .then(() => {
      console.log("The 'books' table was successfully created.");
      return promisifiedDb.run("INSERT INTO books (title) VALUES (?)", [
        "SampleBook",
      ]);
    })
    .then((result) => {
      console.log(`ID: ${result.lastID}`);
      return promisifiedDb.all("SELECT id, title FROM books");
    })
    .then((rows) => {
      console.log("Books:", rows);
      return promisifiedDb.run("DROP TABLE books");
    })
    .then(() => {
      console.log("The 'books' table was successfully dropped.");
      return promisifiedDb.close();
    })
    .then(() => {
      console.log("The database connection has been successfully closed.");
    });
}

main();
