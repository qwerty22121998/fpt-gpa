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

const rankLabel = (grade) => {
  if (grade >= 9) return "label-warning";
  if (grade >= 8) return "label-primary";
  if (grade >= 5) return "label-info";
  return "label-danger";
};

const round = (num) => Math.round(num * 100) / 100;
