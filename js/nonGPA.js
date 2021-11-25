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

const renderNonGPAEditor = () => {
  const root = createHTML(`<div class="table-responsive"/>`);
  const table = createHTML(`<table class="table" />`);
  root.append(table);
  const thead = table.createTHead();
  // List non gpa subject
  const listSubjRow = thead.insertRow();
  const listSubjCell = createHTML('<td class="w-50"/>');

  const renderList = () => {
    listSubjCell.innerHTML = "";
    nonGPAList.forEach((subj) => {
      const removeBtn = createHTML(
        `<a href="#" class="non-gpa non-gpa-delete label label-danger">x</a>`
      );
      removeBtn.onclick = async () => {
        nonGPAList = nonGPAList.filter((e) => e != subj);
        renderList();
      };
      const block = createHTML(`<div class="inline-block"/>`);
      block.append(
        createHTML(`<span class="non-gpa label label-primary">${subj}</span>`),
        removeBtn
      );
      listSubjCell.append(block);
    });
  };
  renderList();

  // Submit / reset default
  const submitCell = createHTML(`<th rowspan="2" class="w-25 buttons"//>`);

  const defaultBtn = createHTML(
    `<span class="btn btn-warning w-100">Mặc định</span>`
  );
  defaultBtn.onclick = () => {
    nonGPAList = DefaultNonGPA;
    setNonGPAList(nonGPAList);
    renderList();
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
  // Input new subject
  const addSubjRow = thead.insertRow();

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
    renderList();
    input.value = "";
  };

  addSubjCell.append(input, submitBtn);
  addSubjRow.insertCell().append(addSubjCell);

  return root;
};