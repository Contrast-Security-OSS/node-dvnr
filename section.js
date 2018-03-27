'use strict';
const colors = require('./colors');
const tab = '  ';
const fs = require('fs');
let currentMessage = 1;

let file_ts = Date.now();

class Section {
  constructor(msg, packages) {
    this.header = msg;
    this.packages = packages;
    this.data = [];
    this.subsections = [];
  }

  printHeader(depth) {
    let header = this.header;

    if (depth === 0) {
      header = `${currentMessage++}. ${this.header}:`;
      header = colors.bold(header);
    } else {
      for (let i = 0; i < depth; i++) {
        header = `${tab}${header}`;
      }
      header += ':';
    }

    console.log(header);
    this.writeToLog(`${currentMessage}. ${this.header}:\n`);
  }

  print(depth) {
    depth = depth || 0;

    this.printHeader(depth);
    this.data.forEach(data => {
      if (data instanceof Section) {
        data.print(depth + 1);
      } else {
        let print = tab;
        for (let i = 0; i < depth; i++) {
          print += tab;
        }
        print += data.name + ':';
        print += tab;
        print += data.val;
        console.log(print);
        this.writeToLog(print);
      }
    });
  }

  addData(name, val) {
    name instanceof Section
      ? this.data.push(name)
      : this.data.push({ name, val });
  }

  writeToLog(data) {
    if (data == null) {
      return;
    }
    try {
      fs.appendFileSync(`nvnr-${file_ts}.txt`, `${data}\n`);
    } catch (e) {
      // this is in case we don't have permissions to write
      // we don't want to crash, we can still get info from copy&paste email.
    }
  }
}

module.exports = {
  Section,
  file_ts
};
