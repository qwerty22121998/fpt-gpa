const gpaContent = $(`<div></div>`, {
    "class": "gpa-panel",
}).append(`<table class="table table-hover"></table>`)

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

const data = semSubAvg(semSubList(semesterList(record), subjList(record, blackList)))

const table = gpaContent.find("table").get(0)

const generateHeader = (table, header) => {
    let thead = table.createTHead()
    let head = thead.insertRow()
    header.map(h => {
        let th = document.createElement("th")
        let txt = document.createTextNode(h)
        th.appendChild(txt)
        head.appendChild(th)
    })
}

const createTable = (table, data) => {
    data.map(r => {
        let row = table.insertRow()
        row.insertCell().innerHTML = r.semester
        row.insertCell().innerHTML = Math.round(r.avg * 1000) / 1000
    })
}


$(`#ctl00_mainContent_lblRollNumber`).append(` - `).append(gpaBtn)
$(`#Grid`).before(gpaContent)
generateHeader(table, ["Semester", "GPA"])
createTable(table, data)
