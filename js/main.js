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
    tbl.style.borderSpacing = "12px";

    const theader = tbl.createTHead();
    const header = theader.insertRow(0);
    header.style.textAlign = "left";
    header.insertCell(0).innerHTML = "<b>Name</b>";
    header.insertCell(1).innerHTML = "<b>File type</b>";
    header.insertCell(2).innerHTML = "<b>Size</b>";
    header.insertCell(3).innerHTML = "<b>Operation</b>";

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
        tr.style.textAlign = "left";
        tr.style.color = "#606266";
        tr.style.fontSize = "14px";

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

// from portal
const tableData = [
    {
        "name":"template.json",
        "path":"files/template.json",
        "size":51,
        "icon":"JSON",
        "uri":"s3://blackfynn-discover-use1/84/1/files/template.json",
        "fileType":"Json",
        "packageType":"Unsupported",
        "sourcePackageId":"N:package:98757b39-b18e-4940-82f3-f84b4856fce3",
        "createdAt":null,
        "type":"File"
    },
    {
        "name": "subjects.xlsx",
        "path": "files/subjects.xlsx",
        "size": 50638,
        "icon": "Excel",
        "uri": "s3://blackfynn-discover-use1/32/3/files/subjects.xlsx",
        "fileType": "MSExcel",
        "packageType": "Unsupported",
        "sourcePackageId": "N:package:daee8c23-7036-4ea6-a78c-18f7ac8fa962",
        "createdAt": null,
        "type": "File"
    },
    {
        "name": "submission.xlsx",
        "path": "files/submission.xlsx",
        "size": 5975,
        "icon": "Excel",
        "uri": "s3://blackfynn-discover-use1/32/3/files/submission.xlsx",
        "fileType": "MSExcel",
        "packageType": "Unsupported",
        "sourcePackageId": "N:package:a9332bb2-a234-438c-ac3e-851bc0e032ab",
        "createdAt": null,
        "type": "File"
    }
];
populateTable(filesTable, tableData);


const footer = createImage("resources/footer.png");
document.body.appendChild(footer);
