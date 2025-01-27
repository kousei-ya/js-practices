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
      return promisifiedDb.run("INSERT INTO reports (title) VALUES (?)", [
        "SampleBook",
      ]);
    })
    .catch((err) => {
      console.error(err.message);
      return promisifiedDb.all("SELECT content FROM books");
    })
    .catch((err) => {
      console.error(err.message);
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
