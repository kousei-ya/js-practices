import sqlite3 from "sqlite3";
import { promisifyDatabase } from "./sqlite_promisified.js";

async function main() {
  const db = new sqlite3.Database(":memory:");
  const promisifiedDb = promisifyDatabase(db);
  await promisifiedDb.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  console.log("The 'books' table was successfully created.");

  try {
    await promisifiedDb.run("INSERT INTO reports (title) VALUES (?)", [
      "SampleBook",
    ]);
  } catch (err) {
    if (err.message.includes("no such table")) {
      console.error("Error: The 'reports' table does not exist.");
    } else {
      throw err;
    }
  }

  try {
    await promisifiedDb.all("SELECT content FROM books");
  } catch (err) {
    if (err.message.includes("no such column")) {
      console.error("Expected error: The column 'content' does not exist.");
    } else {
      throw err;
    }
  }

  await promisifiedDb.run("DROP TABLE books");
  console.log("The 'books' table was successfully dropped.");

  await promisifiedDb.close();
  console.log("The database connection has been successfully closed.");
}

main();
