const SemIndex = {
  Spring: 0,
  Summer: 1,
  Fall: 2,
};

const extractText = (node) => {
  if (node.childElementCount == 0) {
    return node.innerHTML;
  }
  return extractText(node.childNodes[0]);
};

const createHTML = (content) => {
  const template = document.createElement("template");
  template.innerHTML = content.trim();
  return template.content.firstChild;
};

const createElement = (root, ...elems) => {
  const div = document.createElement(root);
  elems.forEach((e) => {
    div.append(e);
  });
  return div;
};

class TableRender {
  table = null;
  header = null;
  body = null;
  constructor() {
    this.table = createHTML(
      `<table id="gpa-table" class="table table-hover"/>`
    );
    this.header = this.table.createTHead();
    this.body = this.table.createTBody();
  }

  addHeader(...cells) {
    const row = this.header.insertRow();
    cells.forEach((e) => {
      row.insertCell().outerHTML = `<th>${e}</th>`;
    });
  }

  addRow(...cells) {
    const row = this.body.insertRow();
    cells.forEach((e) => {
      row.insertCell().append(e);
    });
  }

  render() {
    return this.table;
  }
}

const rankLabel = (grade) => {
  if (grade >= 9) return "label-warning";
  if (grade >= 8) return "label-primary";
  if (grade >= 5) return "label-info";
  return "label-danger";
};
