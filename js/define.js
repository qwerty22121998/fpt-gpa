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

  toString() {
    return JSON.stringify(this);
  }

  isGPA() {
    return this.credit != 0;
  }

  shortDesc() {
    return `Name: ${this.name}\nStatus: ${this.status}\nCredit: ${this.credit}\nGrade: ${this.grade}`;
  }

  pointLabel() {
    if (this.status == "Not passed") return "label-danger";
    if (this.isGPA()) {
      return "label-success";
    }
    return "label-default";
  }

  render() {
    const div = createHTML(`<div class="subject-block"/>`);
    div.append(
      createHTML(
        `<span
         class="code label ${this.pointLabel()}" title="${this.shortDesc()}">${
          this.code
        }</span>`
      )
    );

    if (this.isGPA())
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
    this.semester = name.slice(0, -4);
    this.year = name.slice(-4);
  }

  gpa() {
    const avg = this.subjects.reduce(
      (avg, subj) => ({
        sum: avg.sum + subj.grade * subj.credit,
        total: avg.total + subj.credit,
      }),
      {
        sum: 0,
        total: 0,
      }
    );
    const gpa = avg.sum / avg.total;
    return createHTML(`<span class="label ${rankLabel(gpa)}">${gpa}</span>`);
  }

  get Semester() {
    return createHTML(
      `<span class="label label-primary">${this.semester}</span>`
    );
  }

  get Subjects() {
    const div = document.createElement("div");
    this.subjects.forEach((sub) => {
      div.append(sub.render());
    });
    return div;
  }
}
