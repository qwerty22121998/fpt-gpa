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

const parseGrade = (doms) => {
  return [...doms.querySelectorAll("tbody>tr")].map((tr) => {
    let tds = tr.querySelectorAll("td");
    return new Subject(...[2, 3, 6, 7, 8, 9].map((e) => extractText(tds[e])));
  });
};

const showButtonDOM = () => {
  const dom = createHTML(
    `<button class="label label-success" id="gpa-btn" type="button">Show GPA</button>`
  );

  return dom;
};

const renderShowButton = (headerDOM) => {
  headerDOM.append(" - ", showButtonDOM());
};

const getGPAInfo = (mainGrade) => {
  let gpa = mainGrade.reduce(
    (avg, sub) => {
      if (sub.includeInGPA() && sub.status == "Passed")
        return {
          sum: avg.sum + sub.grade * sub.credit,
          total: avg.total + sub.credit,
        };
      return avg;
    }, {
      sum: 0,
      total: 0,
    }
  );
  return gpa;
}

const createMapSemester = (mainGrade) => {
  let mapSemester = {};

  mainGrade.forEach((subj) => {
    if (!subj.semester) subj.semester = subj.status;
    if (!mapSemester[subj.semester]) {
      mapSemester[subj.semester] = new Semester(subj.semester);
    }
    mapSemester[subj.semester].subjects.push(subj);
  });

  return mapSemester;
}

const buildGPATable = (mapSemester, mainGrade) => {
  const table = new GPATable();
  table.addHeader("SEMESTER", "YEAR", "SUBJECTS", "GPA");
  const report = Object.values(mapSemester).sort((a, b) => {
    if (a.year != b.year) return a.year - b.year;
    return SemIndex[a.semester] - SemIndex[b.semester];
  });
  report.forEach((sem) => {
    table.addRow(sem.SemesterDOM, sem.Year, sem.SubjectsDOM, sem.GpaDOM);
  });
  let gpaInfo = getGPAInfo(mainGrade);
  let gpa = gpaInfo.sum / gpaInfo.total;
  table.addRow(
    "",
    "",
    createHTML("<h4><b>Total avg</b></h4>"),
    createHTML(
      `<h4 style="text-align:start"><span class="label ${rankLabel(
        gpa
      )}">${gpa}</span></h4>`
    )
  );
  return table;
}

const appendGPATable = (table) => {
  const container = createHTML(`<div id="gpa-panel">`);
  const showBtnDOM = showButtonDOM();

  console.log(container.style.maxHeight);
  showBtnDOM.onclick = () => {
    console.log(container.style.maxHeight);
    if (container.style.maxHeight != "0px") {
      container.style.maxHeight = "0px";
    } else {
      container.style.maxHeight = container.scrollHeight + 30 + "px";
    }
  };

  headerDOM.append(" - ", showBtnDOM);
  container.append(renderNonGPAEditor(), table.DOM());
  gridDom.prepend(container);
  container.style.maxHeight = container.scrollHeight + "px";
};

const renderList = (listSubjCell, nonGPAList) => {
  listSubjCell.innerHTML = "";
  nonGPAList.forEach((subj) => {
    const removeBtn = createHTML(
      `<a href="#" class="non-gpa non-gpa-delete label label-danger">x</a>`
    );
    removeBtn.onclick = async () => {
      nonGPAList = nonGPAList.filter((e) => e != subj);
      renderList(listSubjCell, nonGPAList);
    };
    const block = createHTML(`<div class="inline-block"/>`);
    block.append(
      createHTML(`<span class="non-gpa label label-primary">${subj}</span>`),
      removeBtn
    );
    listSubjCell.append(block);
  });
};