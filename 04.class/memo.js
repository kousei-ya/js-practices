import db from "./memo_db.js";
import Enquirer from "enquirer";
const { prompt } = Enquirer;

class MemoManager {
  async addMemo(content) {
    try {
      const result = await db.run("INSERT INTO memos (content) VALUES (?)", [
        content,
      ]);

      const row = await db.get("SELECT content FROM memos WHERE id = ?", [
        result.lastID,
      ]);

      console.log(
        `${row.content.replace(/\\n/g, "\n").split("\n")[0].trim()}が追加されました`,
      );
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

      return rows.map(
        (row) => row.content.replace(/\\n/g, "\n").split("\n")[0],
      );
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
      if (memos.length === 0) {
        return;
      }

      const answer = await prompt({
        type: "select",
        name: "memo",
        message: "削除するメモを選択してください:",
        choices: memos.map((memo) => memo.trim()),
      });

      const memoToDelete = memos.find((memo) => memo.trim() === answer.memo);

      if (!memoToDelete) {
        console.log("削除対象のメモが見つかりませんでした。");
        return;
      }

      await db.run("DELETE FROM memos WHERE content LIKE ?", [
        `${memoToDelete}%`,
      ]);
      console.log(`${memoToDelete}が削除されました`);
    } catch (error) {
      console.error("メモの削除に失敗しました:", error.message);
    }
  }
}

export default MemoManager;
