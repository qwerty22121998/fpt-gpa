class Subject {
  semester;
  code;
  credit;
  grade;
  status;
  name;
  constructor(semester, code, name, credit, grade, status) {
    this.semester = semester;
    this.code = code;
    this.name = name;
    this.credit = +credit;
    this.grade = +grade;
    this.status = status;
  }

  includeInGPA() {
    for (let code of nonGPAList) {
      if (this.code.startsWith(code)) {
        return false;
      }
    }
    return this.credit != 0;
  }

  shortDesc() {
    return `Name: ${this.name}\nStatus: ${this.status}\nCredit: ${this.credit}\nGrade: ${this.grade}`;
  }

  pointLabel() {
    if (this.status == "Not passed") return "label-danger";
    if (this.includeInGPA()) {
      return "label-success";
    }
    return "label-default";
  }

  DOM() {
    const div = createHTML(`<div class="subject-block"/>`);
    div.append(
      createHTML(
        `<span
         class="code label ${this.pointLabel()}" title="${this.shortDesc()}">${
          this.code
        }</span>`
      )
    );

    if (this.includeInGPA())
      div.append(
        createHTML(
          `<span class="label point ${rankLabel(this.grade)}">${this.grade} x ${
            this.credit
          }</span>`
        )
      );
    return div;
  }
}

class Semester {
  semester;
  year;
  subjects = [];
  constructor(name) {
    if (name == "Not started") {
      this.semester = name;
      this.year = "";
    } else {
      this.semester = name.slice(0, -4);
      this.year = name.slice(-4);
    }
  }

  get Year() {
    return this.year;
  }
  get GpaDOM() {
    const avg = getGPAInfo(this.subjects);
    if (avg.total == 0) {
      return createHTML(`<span class="label label-default">No Data</span>`);
    }
    const gpa = round(avg.sum / avg.total);
    return createHTML(`<span class="label ${rankLabel(gpa)}">${gpa}</span>`);
  }

  get SemesterDOM() {
    switch (this.semester) {
      case "Summer":
        return createHTML(`<span class="label label-warning">Summer</span>`);
      case "Spring":
        return createHTML(`<span class="label label-success">Spring</span>`);
      case "Fall":
        return createHTML(`<span class="label label-info">Fall</span>`);
      default:
        return createHTML(
          `<span class="label label-default">${this.semester}</span>`
        );
    }
  }

  get SubjectsDOM() {
    const div = document.createElement("div");
    this.subjects.forEach((sub) => {
      div.append(sub.DOM());
    });
    return div;
  }
}

class GPATable {
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

  DOM() {
    return this.table;
  }
}