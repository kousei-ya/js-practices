#!/usr/bin/env node

import Memo from "./memo.js";
import MemoDb from "./memo_db.js";
import Enquirer from "enquirer";

class MemoApp {
  constructor() {
    this.db = new MemoDb();
    Memo.init(this.db);
  }

  async run() {
    const args = process.argv.slice(2);

    try {
      if (args.length === 0) {
        await this.addMemoFromInput();
      } else if (args[0] === "-l") {
        await this.listMemos();
      } else if (args[0] === "-r") {
        await this.readMemo();
      } else if (args[0] === "-d") {
        await this.deleteMemo();
      }
    } catch (error) {
      console.error("エラーが発生しました:", error.message);
    }
  }

  async addMemoFromInput() {
    let input = "";
    process.stdin.on("data", (chunk) => (input += chunk));
    await new Promise((resolve) => process.stdin.on("end", resolve));
    input = input.trim();
    if (input) {
      const memo = new Memo(input);
      await memo.save();
      console.log(`${this.getTitle(memo.content)}が追加されました`);
    }
  }

  async listMemos() {
    const memos = await Memo.all();
    if (memos.length === 0) {
      console.log("メモがありません");
    } else {
      console.log(memos.map((memo) => this.getTitle(memo.content)).join("\n"));
    }
  }

  async readMemo() {
    const memos = await Memo.all();
    if (memos.length === 0) {
      console.log("メモがありません");
      return;
    }

    const { prompt } = Enquirer;
    const answer = await prompt({
      type: "select",
      name: "memo",
      message: "表示するメモを選択してください:",
      choices: memos.map((memo) => ({
        name: memo.id.toString(),
        message: this.getTitle(memo.content),
      })),
    });

    const memo = await Memo.findById(parseInt(answer.memo, 10));
    if (memo) {
      console.log("\n" + memo.content.replace(/\\n/g, "\n"));
    } else {
      console.log("メモが見つかりませんでした");
    }
  }

  async deleteMemo() {
    const memos = await Memo.all();
    if (memos.length === 0) {
      console.log("メモがありません");
      return;
    }

    const { prompt } = Enquirer;
    const answer = await prompt({
      type: "select",
      name: "memo",
      message: "削除するメモを選択してください:",
      choices: memos.map((memo) => ({
        name: memo.id.toString(),
        message: this.getTitle(memo.content),
      })),
    });

    const memoId = parseInt(answer.memo, 10);
    const memo = await Memo.findById(memoId);
    if (memo) {
      await memo.delete();
      console.log(`${this.getTitle(memo.content)}を削除しました`);
    } else {
      console.log("メモが見つかりませんでした");
    }
  }

  getTitle(content) {
    return content.split("\n")[0];
  }
}

const app = new MemoApp();
app.run();
