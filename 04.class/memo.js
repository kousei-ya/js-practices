import MemoDb from "./memo_db.js";

class Memo {
  constructor(content, id = null) {
    this.id = id;
    this.content = content;
  }

  static async all() {
    const rows = await MemoDb.all("SELECT id, content FROM memos");
    return rows.map((row) => new Memo(row.content, row.id));
  }

  static async findById(id) {
    const row = await MemoDb.get("SELECT id, content FROM memos WHERE id = ?", [
      id,
    ]);
    return row ? new Memo(row.content, row.id) : null;
  }

  static async deleteById(id) {
    await MemoDb.run("DELETE FROM memos WHERE id = ?", [id]);
  }

  async save() {
    if (this.id) {
      await MemoDb.run("UPDATE memos SET content = ? WHERE id = ?", [
        this.content,
        this.id,
      ]);
    } else {
      const result = await MemoDb.run(
        "INSERT INTO memos (content) VALUES (?)",
        [this.content],
      );
      this.id = result.lastID;
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error("削除対象のメモはまだ保存されていません");
    }
    await MemoDb.run("DELETE FROM memos WHERE id = ?", [this.id]);
  }
}

export default Memo;
