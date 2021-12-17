let nonGPAList = [];

const getNonGPAList = () => {
  return new Promise((res, rej) => {
    chrome.storage.sync.get([NonGPAKey], (list) => {
      list = list[NonGPAKey];
      if (!Array.isArray(list)) {
        list = DefaultNonGPA;
        setNonGPAList(list);
      }
      console.log("GET NON_GPA", list);
      nonGPAList = list;
      res(nonGPAList);
    });
  });
};

const setNonGPAList = async (list) => {
  await chrome.storage.sync.set({
    NonGPAKey: list
  }, function () {
    console.log("SET NON_GPA", list);
    location.reload();
  });
};

const renderList = (listSubjCell) => {
  listSubjCell.innerHTML = "";
  nonGPAList.forEach((subj) => {
    const removeBtn = createHTML(
      `<a href="#" class="non-gpa non-gpa-delete label label-danger">x</a>`
    );
    removeBtn.onclick = async () => {
      nonGPAList = nonGPAList.filter((e) => e != subj);
      console.log(nonGPAList);
      renderList(listSubjCell);
    };
    const block = createHTML(`<div class="inline-block"/>`);
    block.append(
      createHTML(`<span class="non-gpa label label-primary">${subj}</span>`),
      removeBtn
    );
    listSubjCell.append(block);
  });
};

const inputNonGPARow = (listSubjCell, addSubjRow) => {
  addSubjRow.insertCell().outerHTML = "<th>Thêm môn vào danh sách:</th>";

  const addSubjCell = createHTML(`<div class="input-group"></div>`);
  const input = createHTML(
    `<input class="form-control" placeholder="Nhập mã môn ( không cần số )"/>`
  );
  const submitBtn = createHTML(
    `<div class="input-group-btn"><span class="btn btn-success">Thêm vào danh sách</span></div>`
  );
  submitBtn.onclick = () => {
    const subject = input.value;
    if (!subject) return;
    console.log(subject);
    nonGPAList.push(subject);
    renderList(listSubjCell);
    input.value = "";
  };

  addSubjCell.append(input, submitBtn);
  addSubjRow.insertCell().append(addSubjCell);
}

const showNonGPARow = (listSubjRow) => {
  const listSubjCell = createHTML('<td class="w-50"/>');

  renderList(listSubjCell);

  // Submit / reset default
  const submitCell = createHTML(`<th rowspan="2" class="w-25 buttons"//>`);

  const defaultBtn = createHTML(
    `<span class="btn btn-warning w-100">Mặc định</span>`
  );
  defaultBtn.onclick = () => {
    nonGPAList = DefaultNonGPA;
    setNonGPAList(nonGPAList);
    renderList(listSubjCell);
  };

  const saveBtn = createHTML(`<span class="btn btn-primary w-100">Lưu</span>`);
  saveBtn.onclick = () => {
    console.log(nonGPAList);
    setNonGPAList(nonGPAList);
  };

  submitCell.append(
    defaultBtn,
    createHTML(`<div class="spacing-h"/>`),
    saveBtn
  );

  listSubjRow.append(
    createHTML('<th class="w-25"><b>Các môn không tính vào GPA: </b></th>'),
    listSubjCell,
    submitCell
  );
  return listSubjCell;
}

const renderNonGPAEditor = () => {
  const root = createHTML(`<div class="table-responsive"/>`);
  const table = createHTML(`<table class="table" />`);
  root.append(table);
  const thead = table.createTHead();

  // List non gpa subject
  const listSubjRow = thead.insertRow();
  listSubjCell = showNonGPARow(listSubjRow);

  const addSubjRow = thead.insertRow();
  inputNonGPARow(listSubjCell, addSubjRow);

  return root;
};
