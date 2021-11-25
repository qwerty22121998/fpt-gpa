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

const inputNonGPARow = (addSubjRow, nonGPAList) => {
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
    renderList(listSubjCell, nonGPAList);
    input.value = "";
  };

  addSubjCell.append(input, submitBtn);
  addSubjRow.insertCell().append(addSubjCell);
  return nonGPAList;
}

const showNonGPARow = (listSubjRow, nonGPAList) => {
  const listSubjCell = createHTML('<td class="w-50"/>');

  renderList(listSubjCell, nonGPAList);

  // Submit / reset default
  const submitCell = createHTML(`<th rowspan="2" class="w-25 buttons"//>`);

  const defaultBtn = createHTML(
    `<span class="btn btn-warning w-100">Mặc định</span>`
  );
  defaultBtn.onclick = () => {
    nonGPAList = DefaultNonGPA;
    setNonGPAList(nonGPAList);
    renderList(listSubjCell, nonGPAList);
  };

  const saveBtn = createHTML(`<span class="btn btn-primary w-100">Lưu</span>`);
  saveBtn.onclick = () => {
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
  return nonGPAList;
}

const renderNonGPAEditor = () => {
  const root = createHTML(`<div class="table-responsive"/>`);
  const table = createHTML(`<table class="table" />`);
  root.append(table);
  const thead = table.createTHead();

  // List non gpa subject
  const listSubjRow = thead.insertRow();
  nonGPAList = showNonGPARow(listSubjRow, nonGPAList);

  const addSubjRow = thead.insertRow();
  nonGPAList = inputNonGPARow(addSubjRow, nonGPAList);

  return root;
};
