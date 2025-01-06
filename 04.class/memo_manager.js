import db from "./memo_db.js";
import Memo from "./memo.js";
import Enquirer from "enquirer";
const { prompt } = Enquirer;

class MemoManager {
  async addMemo(content) {
    try {
      const result = await db.run("INSERT INTO memos (content) VALUES (?)", [
        content,
      ]);

      const memo = new Memo(result.lastID, content);

      console.log(`${memo.title}が追加されました`);
    } catch (error) {
      console.error("メモの追加に失敗しました:", error.message);
    }
  }

  async listMemos() {
    try {
      const rows = await db.all("SELECT id, content FROM memos");

      if (rows.length === 0) {
        console.log("メモがありません");
      }
      return rows.map((row) => {
        const memo = new Memo(row.id, row.content);
        return `${memo.title}`;
      });
    } catch (error) {
      console.error("メモの取得に失敗しました:", error.message);
      return [];
    }
  }

  async readMemo() {
    try {
      const memos = await this.listMemos();
      if (memos.length === 0) {
        return;
      }

      const answer = await prompt({
        type: "select",
        name: "memo",
        message: "表示するメモを選択してください:",
        choices: memos,
      });

      const row = await db.get(
        "SELECT content FROM memos WHERE content LIKE ?",
        [`${answer.memo}%`],
      );

      if (row) {
        console.log("\n" + row.content.replace(/\\n/g, "\n"));
      } else {
        console.log("表示するメモが見つかりませんでした。");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteMemo() {
    try {
      const memos = await this.listMemos();
      if (memos.length === 0) return;

      const answer = await prompt({
        type: "select",
        name: "memo",
        message: "削除するメモを選択してください:",
        choices: memos,
      });

      const row = await db.get("SELECT id FROM memos WHERE content LIKE ?", [
        `${answer.memo}%`,
      ]);

      if (row) {
        await db.run("DELETE FROM memos WHERE id = ?", [row.id]);
        console.log(`${answer.memo} が削除されました`);
      } else {
        console.log("削除対象のメモが見つかりませんでした。");
      }
    } catch (error) {
      console.error("メモの削除に失敗しました:", error.message);
    }
  }
}

export default MemoManager;
