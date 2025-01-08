#!/usr/bin/env node

import Memo from "./memo.js";
import MemoDb from "./memo_db.js";
import Enquirer from "enquirer";

class MemoApp {
  constructor() {
    this.memoService = new Memo(MemoDb);
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
      const memo = await this.memoService.addMemo(input);
      console.log(`${this.getTitle(memo.content)}が追加されました`);
    }
  }

  async listMemos() {
    const memos = await this.memoService.listMemos();
    if (memos.length === 0) {
      console.log("メモがありません");
    } else {
      console.log(memos.map((memo) => this.getTitle(memo.content)).join("\n"));
    }
  }

  async readMemo() {
    const memos = await this.memoService.listMemos();
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

    const memo = await this.memoService.getMemo(parseInt(answer.memo, 10));
    if (memo) {
      console.log("\n" + memo.content.replace(/\\n/g, "\n"));
    } else {
      console.log("メモが見つかりませんでした");
    }
  }

  async deleteMemo() {
    const memos = await this.memoService.listMemos();
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
    const deleted_memo_title = this.getTitle(
      memos.find((memo) => memo.id === memoId).content,
    );

    await this.memoService.deleteMemo(memoId);
    console.log(`${deleted_memo_title}を削除しました`);
  }

  getTitle(content) {
    return content.split("\n")[0];
  }
}

const app = new MemoApp();
app.run();
