
const blackList = ["OJS", "VOV", "GDQP"]

const record = $(".table.table-hover>tbody:first>tr")

const semesterList = (record) => record.find("td:nth-child(3)").toArray().
    filter(e => e.firstChild !== null).map(e => e.firstChild.textContent).
    map(e => {
        let h = e.length / 2;
        return e.slice(0, h) !== e.slice(h) ? e : e.slice(0, h)
    }).
    filter((e, i, a) => a.indexOf(e) === i)

const subjList = (record, blackList) => record.toArray().
    map((e) => ({
        "term": e.childNodes[0].textContent,
        "semester": e.childNodes[2].textContent,
        "subject_code": e.childNodes[3].textContent,
        "credit": e.childNodes[6].textContent,
        "grade": e.childNodes[7].textContent,
        "status": e.childNodes[8].textContent,
    })).filter(e => e.term !== "0" && !blackList.some(prefix => e.subject_code.includes(prefix)) && e.grade && e.status == "Passed")

const semSubList = (sem, sub) => sem.map(sem => ({
    "semester": sem,
    "list": sub.filter(sub => sub.semester == sem)
}))
// .filter(semsub => semsub.list.length)


const avg = sem => sem.list.map(sem => sem.grade * sem.credit).
    reduce((a, b) => a - -b, 0) / sem.list.map(sem => sem.credit).reduce((a, b) => a - -b, 0)

const semSubAvg = semsub => semsub.map(semsub => {
    semsub.avg = avg(semsub)
    return semsub
})

const totalAvg = semsub => {
    let semsubFiltered = semsub.filter(semsub => semsub.list.length)
    let totalGrade = semsubFiltered.reduce((a, b) =>
        a + b.list.reduce((u, v) => u - -v.grade * v.credit, 0), 0)

    let totalCredit = semsubFiltered.reduce((a, b) =>
        a + b.list.reduce((u, v) => u - -v.credit, 0), 0)
    return totalGrade / totalCredit

}

