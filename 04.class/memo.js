class Memo {
  constructor(database) {
    this.database = database;
  }

  async addMemo(content) {
    return await this.database.addMemo(content);
  }

  async listMemos() {
    return await this.database.getAllMemos();
  }

  async getMemo(id) {
    return await this.database.getMemoById(id);
  }

  async deleteMemo(id) {
    await this.database.deleteMemoById(id);
  }
}

export default Memo;
