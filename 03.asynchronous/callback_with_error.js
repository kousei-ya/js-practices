import sqlite3 from "sqlite3";

function main() {
  const db = new sqlite3.Database(":memory:");
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    (_) => {
      console.log("books' table was successfully created.");

      db.run(
        "INSERT INTO reports (content) VALUES (?)",
        ["SsampleBook"],
        (err) => {
          if (err) {
            console.error(err.message);
          }

          db.all("SELECT content FROM books", (err) => {
            if (err) {
              console.error(err.message);
            }

            db.run("DROP TABLE books", (_) => {
              console.log("The 'books' table was successfully dropped.");

              db.close(() => {
                console.log(
                  "The database connection has been successfully closed.",
                );
              });
            });
          });
        },
      );
    },
  );
}

main();
