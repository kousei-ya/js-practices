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
      console.log("Table created!");
      return pdb.run("INSERT INTO reports (title) VALUES (?)", ["SampleBook"]);
    })
    .catch((err) => {
      console.error(err.message);
    })
    .then(() => {
      return pdb.all("SELECT content FROM books");
    })
    .catch((err) => {
      console.error(err.message);
      return pdb.run("DROP TABLE books");
    })
    .then(() => {
      console.log("Table dropped!");
      return pdb.close();
    })
    .then(() => {
      console.log("Dataabase closed!");
    });
}

main();
