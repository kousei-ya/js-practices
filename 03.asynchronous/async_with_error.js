import sqlite3 from "sqlite3";
import { promisifyDatabase } from "./sqlite_promisifier.js";

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
    if (
      err instanceof Error &&
      typeof err.message === "string" &&
      err.message.includes("no such table")
    ) {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  try {
    await promisifiedDb.all("SELECT content FROM books");
  } catch (err) {
    if (
      err instanceof Error &&
      typeof err.message === "string" &&
      err.message.includes("no such column")
    ) {
      console.error(err.message);
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
