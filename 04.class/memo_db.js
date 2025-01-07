import sqlite3 from "sqlite3";
sqlite3.verbose();

class MemoDb {
  constructor() {
    this.db = new sqlite3.Database("./memos.db", (err) => {
      if (err) {
        console.error("データベースの接続に失敗しました:", err.message);
        process.exit(1);
      }
    });

    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS memos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL
        )
      `);
    });
  }

  async addMemo(content) {
    const result = await this.run("INSERT INTO memos (content) VALUES (?)", [
      content,
    ]);
    return { id: result.lastID, content };
  }

  async getAllMemos() {
    return await this.all("SELECT id, content FROM memos");
  }

  async getMemoById(id) {
    return await this.get("SELECT id, content FROM memos WHERE id = ?", [id]);
  }

  async deleteMemoById(id) {
    await this.run("DELETE FROM memos WHERE id = ?", [id]);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

export default new MemoDb();
