const NonGPAKey = "NonGPAKey";

//ID
const MainContentID = "ctl00_mainContent_divGrade";
const HeaderID = "ctl00_mainContent_lblRollNumber";
const GridID = "ctl00_mainContent_divGrade";

//DOM
const gradeTablesDOM = document
  .getElementById(MainContentID)
  .querySelectorAll("table");
const headerDOM = document.getElementById(HeaderID);
const gridDom = document.getElementById(GridID);
const SemIndex = {
  Spring: 0,
  Summer: 1,
  Fall: 2,
};

const DefaultNonGPA = ["OJS", "VOV", "GDQP", "LAB", "ENT", "SSS", "ĐNH"];
