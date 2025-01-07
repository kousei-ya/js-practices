#!/usr/bin/env node

import MemoManager from "./memo_manager.js";

class MemoApp {
  constructor() {
    this.memoManager = new MemoManager();
  }

  async run() {
    const args = process.argv.slice(2);

    try {
      if (args.length === 0) {
        let input = "";
        process.stdin.on("data", (chunk) => (input += chunk));
        process.stdin.on("end", async () => {
          input = input.trim();
          if (input) {
            await this.memoManager.addMemo(input);
          }
        });

        await new Promise((resolve) => process.stdin.on("end", resolve));
      } else if (args[0] === "-l") {
        const memos = await this.memoManager.listMemos();
        console.log(memos.join("\n"));
      } else if (args[0] === "-r") {
        await this.memoManager.readMemo();
      } else if (args[0] === "-d") {
        await this.memoManager.deleteMemo();
      }
    } catch (error) {
      console.error("エラーが発生しました:", error.message);
    }
  }
}

const app = new MemoApp();
app.run();
