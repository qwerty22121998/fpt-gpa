"use strict";

const DefaultBlackList = ["OJS", "VOV", "GDQP", "LAB", "ENT", "SSS", "ĐNH"];

const MainContentID = "ctl00_mainContent_divGrade";
const HeaderID = "ctl00_mainContent_lblRollNumber";
const GridID = "ctl00_mainContent_divGrade";

const gradeTablesDOM = document
  .getElementById(MainContentID)
  .querySelectorAll("table");
const headerDOM = document.getElementById(HeaderID);
const gridDom = document.getElementById(GridID);

const mapSemester = {};

const getGradeFromTable = (doms) => {
  return [...doms.querySelectorAll("tbody>tr")].map((tr) => {
    let tds = tr.querySelectorAll("td");
    return new Subject(...[2, 3, 6, 7, 8, 9].map((e) => extractText(tds[e])));
  });
};

const mainGrade = getGradeFromTable(gradeTablesDOM[0]);

const renderShowButton = (headerDOM) => {
  headerDOM.append(
    " - ",
    createHTML(
      `<a href="#gpa-table" class="label label-success" id="gpa-btn" type="button">Show GPA</a>`
    )
  );
};

mainGrade.forEach((subj) => {
  if (!mapSemester[subj.semester]) {
    mapSemester[subj.semester] = new Semester(subj.semester);
  }
  mapSemester[subj.semester].subjects.push(subj);
});

const semester = Object.values(mapSemester).sort((a, b) => {
  if (a.year != b.year) return a.year - b.year;
  return SemIndex[a.semester] - SemIndex[b.semester];
});

const renderTable = () => {
  const table = new TableRender();
  table.addHeader("YEAR", "SEMESTER", "SUBJECTS", "GPA");
  semester.forEach((sem) => {
    table.addRow(sem.year, sem.Semester, sem.Subjects, sem.gpa());
  });
  let gpa = mainGrade.reduce(
    (avg, sub) => {
      if (!sub.isGPA()) return avg;
      return {
        sum: avg.sum + sub.grade * sub.credit,
        total: avg.total + sub.credit,
      };
    },
    {
      sum: 0,
      total: 0,
    }
  );
  gpa = gpa.sum / gpa.total;
  table.addRow(
    createHTML("<b>Total avg</b>"),
    "",
    "",
    createHTML(`<span class="label ${rankLabel(gpa)}">${gpa}</span>`)
  );
  return table.render();
};

renderShowButton(headerDOM);
gridDom.prepend(renderTable());
