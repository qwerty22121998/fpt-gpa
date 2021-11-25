"use strict";

const main = async () => {
  await getNonGPAList();
  const mainGrade = parseGrade(gradeTablesDOM[0]);
  const mapSemester = createMapSemester(mainGrade);

  const table = buildGPATable(mapSemester, mainGrade);

  appendGPATable(table);
};

main();