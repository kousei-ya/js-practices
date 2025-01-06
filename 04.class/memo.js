class Memo {
  constructor(id, content) {
    this.id = id;
    this.content = content;
  }

  get title() {
    return this.content.replace(/\\n/g, "\n").split("\n")[0];
  }
}

export default Memo;
