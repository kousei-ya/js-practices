import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

function main() {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      console.log("Table created!");

      db.run(
        "INSERT INTO report (content) VALUES (?)",
        ["SsampleBook"],
        (err) => {
          if (err) {
            console.error(err.message);
          }

          db.all("SELECT content FROM books", (err) => {
            if (err) {
              console.error(err.message);
            }

            db.run("DROP TABLE books", () => {
              console.log("Table dropped.");

              db.close(() => {
                console.log("Database closed.");
              });
            });
          });
        },
      );
    },
  );
}

main();
