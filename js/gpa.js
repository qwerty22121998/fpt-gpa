
const DEFAULT_BLACK_LIST = ["OJS", "VOV", "GDQP", "LAB", "ENT", "SSS", "ĐNH"];

var blackList = [];


const record = $(".table.table-hover>tbody:first>tr");

const getBlackList = () => {
  chrome.storage.sync.get(["blackList"], items => {
    if (!items['blackList']) setBlackList()
    else blackList = items['blackList']
    console.log('black list : ', blackList)
    main()  
  })
}

const setBlackList = (list = DEFAULT_BLACK_LIST) => {
  if (!list) list = DEFAULT_BLACK_LIST
  chrome.storage.sync.set({ blackList: list }, () => {
    blackList = list
    console.log('update black list : ', blackList)
  })
}


const semesterList = record =>
  record
    .find("td:nth-child(3)")
    .toArray()
    .filter(e => e.firstChild !== null)
    .map(e => e.firstChild.textContent)
    .map(e => {
      let h = e.length / 2;
      return e.slice(0, h) !== e.slice(h) ? e : e.slice(0, h);
    })
    .filter((e, i, a) => a.indexOf(e) === i);

const subjList = (record, blackList) =>
  record.toArray().map(e => ({
    term: e.childNodes[0].textContent,
    semester: e.childNodes[2].textContent,
    subject_code: e.childNodes[3].textContent,
    credit: e.childNodes[7].textContent,
    grade: e.childNodes[8].textContent,
    status: e.childNodes[9].textContent
  }));

const semSubList = (sem, sub) =>
  sem.map(sem => ({
    semester: sem,
    list: sub.filter(sub => sub.semester == sem)
  }));

const creditSub = list =>
  list.filter(
    e =>
      e.term !== "0" &&
      !blackList.some(prefix => e.subject_code.includes(prefix)) &&
      e.grade &&
      e.status == "Passed"
  );

const avg = sem => {
  let filtered = creditSub(sem.list);
  return (
    filtered.map(sem => sem.grade * sem.credit).reduce((a, b) => a - -b, 0) /
    filtered.map(sem => sem.credit).reduce((a, b) => a - -b, 0)
  );
};

const semSubAvg = semsub =>
  semsub.map(semsub => {
    semsub.avg = avg(semsub);
    return semsub;
  });

const totalAvg = semsub => {
  let semsubFiltered = semsub.filter(semsub => semsub.list.length);
  let totalGrade = semsubFiltered.reduce(
    (a, b) =>
      a + creditSub(b.list).reduce((u, v) => u - -v.grade * v.credit, 0),
    0
  );

  let totalCredit = semsubFiltered.reduce(
    (a, b) => a + creditSub(b.list).reduce((u, v) => u - -v.credit, 0),
    0
  );
  return totalGrade / totalCredit;
};

const SEM = { Spring: 0, Summer: 1, Fall: 2, Winter: 3 };

const sort = semsubavg => {
  return semsubavg.sort((a, b) => {
    let ayear = a.semester.substr(-4);
    let byear = b.semester.substr(-4);
    if (ayear != byear) {
      return ayear - byear;
    }
    let asem = a.semester.substr(0, a.length - 4);
    let bsem = b.semester.substr(0, b.length - 4);
    return SEM[asem] - SEM[bsem];
  });
};
