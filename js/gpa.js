"use strict";

class Grade {
  semester;
  code;
  credit;
  grade;
  status;
  constructor(semester, code, credit, grade, status) {
    this.semester = semester;
    this.code = code;
    this.credit = credit;
    this.grade = grade;
    this.status = status;
  }
}

const DefaultBlackList = ["OJS", "VOV", "GDQP", "LAB", "ENT", "SSS", "ĐNH"];

const MainContentID = "ctl00_mainContent_divGrade";

const gradeTablesDOM = document
  .getElementById(MainContentID)
  .querySelectorAll("table");

const getGradeFromTable = (doms) => {
  return [...doms.querySelectorAll("tbody>tr")].map((tr) => {
    let tds = tr.querySelectorAll("td");
    return new Grade(...[2, 3, 7, 8, 9].map((e) => extractText(tds[e])));
  });
};

const mainGrade = getGradeFromTable(gradeTablesDOM[0]);

console.log(mainGrade);
