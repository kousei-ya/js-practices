import sqlite3 from "sqlite3";

function main() {
  const db = new sqlite3.Database(":memory:");

  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      console.log("The 'books' table was successfully created.");

      db.run(
        "INSERT INTO books (title) VALUES (?)",
        ["SampleBook"],
        function () {
          console.log(`ID: ${this.lastID}`);

          db.all("SELECT id, title FROM books", (_, rows) => {
            console.log("Books:", rows);

            db.run("DROP TABLE books", () => {
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
