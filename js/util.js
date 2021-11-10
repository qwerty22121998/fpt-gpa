const extractText = (node) => {
  if (node.childElementCount == 0) {
    return node.innerHTML;
  }
  return extractText(node.childNodes[0]);
};
