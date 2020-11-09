function createImage(src, width, height, alt) {
    const img = document.createElement("img");
    img.src = src;
    // img.width = width;
    // img.height = height;
    // img.alt = alt;
    return img;
}

function createTable() {
    const tbl = document.createElement("table");
    tbl.style.width = "1200px";
    tbl.style.marginLeft = "150px";

    const theader = tbl.createTHead();
    const header = theader.insertRow(0);
    header.style.textAlign = "left";
    header.insertCell(0).innerHTML = "<b>Name</b>";
    header.insertCell(1).innerHTML = "<b>File type</b>";
    header.insertCell(2).innerHTML = "<b>Size</b>";
    header.insertCell(3).innerHTML = "<b>Operation</b>";

    return tbl;
}

function populateTable(tbl, data) {
    const tbdy = document.createElement("tbody");
    for (let i=0; i<data.length; i++) {
        const rowData = data[i];
        const tr = tbl.insertRow();
        tr.style.textAlign = "left";
        for (let j=0; j<4; j++) {
            if (j===3) {
                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                const url = "https://staging.osparc.io/v0/";
                fetch(proxyurl + url)
                    .then(response => {
                        response.json()
                            .then(resp => {
                                console.log(resp);
                                const td = tr.insertCell();
                                const a = document.createElement("a");
                                const linkText = document.createTextNode(rowData[j]);
                                a.appendChild(linkText);
                                a.title = rowData[j];
                                a.href = url;
                                td.appendChild(a);
                            })
                            .catch(() => console.error("Can’t access " + url));
                    })
                    .catch(() => console.error("Can’t access proxy"));
            } else {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(rowData[j]));
            }
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}

const header = createImage("resources/header.png");
document.body.appendChild(header);


const filesTable = createTable();
document.body.appendChild(filesTable);

const tableData = [
    ["template.json", "Json", "51B", "Open in oSparc"]
];
populateTable(filesTable, tableData);


const footer = createImage("resources/footer.png");
document.body.appendChild(footer);
