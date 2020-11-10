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
    Object.assign(tbl.style, {
        width: "1200px",
        marginLeft: "150px",
        borderSpacing: "12px",
        textAlign: "left",
        fontSize: "14px",
        color: "#606266"
    });

    const theader = tbl.createTHead();
    const header = theader.insertRow(0);
    header.style.color = "#000000";
    header.insertCell(0).innerHTML = "Name";
    header.insertCell(1).innerHTML = "File type";
    header.insertCell(2).innerHTML = "Size";
    header.insertCell(3).innerHTML = "Operation";

    return tbl;
}

function getDownloadLinkFromBF(uriField) {
    // "uri":"s3://blackfynn-discover-use1/84/1/files/template.json"
    // key: 84/1/files/template.json
    const key = uriField.replace("s3://blackfynn-discover-use1/", "");
    const url = "https://api.sparc.science/download?key=" + key;
    return fetch(url);
}

function populateTable(tbl, data) {
    const tbdy = document.createElement("tbody");
    for (let i=0; i<data.length; i++) {
        const rowData = data[i];
        const tr = tbl.insertRow();

        const td0 = tr.insertCell(0);
        td0.appendChild(document.createTextNode(rowData["name"]));

        const td1 = tr.insertCell(1);
        td1.appendChild(document.createTextNode(rowData["fileType"]));

        const td2 = tr.insertCell(2);
        td2.appendChild(document.createTextNode(rowData["size"] + " B"));

        getDownloadLinkFromBF(rowData["uri"])
            .then(responseDL => {
                console.log(responseDL);
                responseDL.text()
                    .then(downloadLink => {
                        console.log(downloadLink);

                        const proxyurl = "https://cors-anywhere.herokuapp.com/";
                        const url = "https://staging.osparc.io/v0/";
                        fetch(proxyurl + url)
                            .then(response => {
                                response.json()
                                    .then(resp => {
                                        console.log(resp);
                                        const td3 = tr.insertCell(3);
                                        const a = document.createElement("a");
                                        const linkText = document.createTextNode("Open in oSparc");
                                        a.appendChild(linkText);
                                        a.title = "Open in oSparc";
                                        a.href = url;
                                        td3.appendChild(a);
                                    })
                                    .catch(() => console.error("Can’t access " + url));
                            })
                            .catch(() => console.error("Can’t access proxy"));
                    })
                    .catch(err => console.error("Can’t access text", err));
            })
            .catch(() => console.error("Can’t access BF"));

        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}

const header = createImage("resources/header.png");
document.body.appendChild(header);


const filesTable = createTable();
document.body.appendChild(filesTable);
fetch('js/data.json')
    .then(response => response.json())
    .then(tableData => {
        populateTable(filesTable, tableData);
    });


const footer = createImage("resources/footer.png");
document.body.appendChild(footer);
