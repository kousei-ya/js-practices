class Memo {
  constructor(content, id = null) {
    this.id = id;
    this.content = content;
  }

  static init(db) {
    this.db = db;
  }

  static async all() {
    const rows = await this.db.all("SELECT id, content FROM memos");
    return rows.map((row) => new Memo(row.content, row.id));
  }

  static async findById(id) {
    const row = await this.db.get(
      "SELECT id, content FROM memos WHERE id = ?",
      [id],
    );
    return row ? new Memo(row.content, row.id) : null;
  }

  static async deleteById(id) {
    await this.db.run("DELETE FROM memos WHERE id = ?", [id]);
  }

  async save() {
    if (this.id) {
      await Memo.db.run("UPDATE memos SET content = ? WHERE id = ?", [
        this.content,
        this.id,
      ]);
    } else {
      const result = await Memo.db.run(
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
    await Memo.db.run("DELETE FROM memos WHERE id = ?", [this.id]);
  }
}

export default Memo;
