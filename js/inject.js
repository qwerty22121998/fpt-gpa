const matched = x => ({
    on: () => matched(x),
    otherwise: () => x,
})
const match = x => ({
    on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
    otherwise: fn => fn(x),
})

const gpaContent = $(`<div class="gpa-panel"></div>`).append(`<table class="table table-hover"></table>`)

const gpaBtn = $(`<button></button>`, {
    "class": "btn label label-success",
    "id": "gpa-btn",
    "type": "button",
}).text(`Show GPA Chart`).click(() => {
    gpaBtn.toggleClass(`active`)
    let style = gpaContent.css(`max-height`)
    let scroll = gpaContent.get(0).scrollHeight
    gpaContent.css(`max-height`, style === `0px` ? scroll + `px` : `0px`)
})


const rawData = semSubList(semesterList(record), subjList(record, blackList))
const data = sort(semSubAvg(rawData))

const gpaTable = gpaContent.find("table").get(0)

const generateHeader = (table, header) => {
    let thead = table.createTHead()
    let head = thead.insertRow()
    header.map(h => {
        let th = document.createElement(`th`)
        let txt = document.createTextNode(h)
        th.appendChild(txt)
        head.appendChild(th)
    })
}

const labelGradeType = value => {
    switch (true) {
        case value === `No Data`: return `warning`; break
        case value < 5: return `danger`; break
        case value < 8: return `info`; break
        case value < 9: return `primary`; break
        default: return `success`
    }
}

const labelSubType = value => {
    switch (true) {
        case blackList.some(prefix => value.includes(prefix)): return `default`; break
        default: return `primary`; break
    }
}

const labelGrade = data => `<span class="label label-` + labelGradeType(data) + `">` + data + `</span>`
const labelSubject = (data, point, credit) => `<span class="label label-` + labelSubType(data) + `">` + data + `</span>` + (point ? `<span class="label point label-` + labelGradeType(point) + `">` + point + ` x ` + credit + `</span>` : ``)


const generateGPALabel = grade =>
    match(grade).
        on(x => x === `No Data`, x => labelGrade(x)).
        on(x => x < 5, x => labelGrade(x)).
        on(x => x < 8, x => labelGrade(x)).
        on(x => x < 9, x => labelGrade(x)).
        otherwise(x => labelGrade(x))


const insertRow = (table, data) => {
    let row = table.insertRow()
    data.map(data => { row.insertCell().innerHTML = data })
}

const createTable = (table, data) =>
    data.map(r => {
        insertRow(table, [r.semester, r.list.map(
            s => labelSubject(s.subject_code, s.grade, s.credit)).join(` `),
        generateGPALabel(r.avg !== r.avg ? `No Data` : Math.round(r.avg * 1000) / 1000)])
    })


$(`#ctl00_mainContent_lblRollNumber`).append(` - `).append(gpaBtn)
$(`#Grid`).before(gpaContent)
generateHeader(gpaTable, ["Semester", "Subjects", "GPA"])
createTable(gpaTable, data)
insertRow(gpaTable, ["<b>Total Avg</b>", ``, generateGPALabel(totalAvg(rawData))])

