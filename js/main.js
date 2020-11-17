OSPARC_SERVER = "http://localhost:9081/"

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

function getOsparcLink(redirection_url, downloadLink, fileName, fileSize) {
    // http://127.0.0.1:9081/view?file_type=DICOM&file_size=1&file_name=foo&download_link=http%3A%2F%2Fhttpbin.org%2Fimage%2Fjpeg
    let url = redirection_url + "&download_link=" + downloadLink;
    if (fileName) {
        url += "&file_name=" + fileName;
    }
    if (fileSize) {
        url += "&file_size=" + fileSize;
    }
    return encodeURI(url);
}

function populateTable(tbl, supportedFileTypes, data) {
    const tbdy = document.createElement("tbody");
    for (let i=0; i<data.length; i++) {
        const rowData = data[i];
        const tr = tbl.insertRow();

        const td0 = tr.insertCell(0);
        td0.appendChild(document.createTextNode(rowData["name"]));

        const td1 = tr.insertCell(1);
        const fileType = rowData["fileType"];
        td1.appendChild(document.createTextNode(fileType));

        const td2 = tr.insertCell(2);
        td2.appendChild(document.createTextNode(rowData["size"] + " B"));

        const found = supportedFileTypes.find(suppFileType => suppFileType.file_type === fileType);
        if (found) {
            const td3 = tr.insertCell(3);
            const a = document.createElement("a");
            const linkText = document.createTextNode("Open in oSparc");
            a.appendChild(linkText);
            a.title = "Open in oSparc";
            a.href = getOsparcLink(found["redirection_url"], rowData["downloadURL"], rowData["name"], rowData["size"]);
            a.target="_blank"
            td3.appendChild(a);
        }

        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}

const header = createImage("resources/header.png");
document.body.appendChild(header);


const filesTable = createTable();
document.body.appendChild(filesTable);
fetch('js/dataGH.json')
    .then(respTD => respTD.json())
    .then(tableData => {
        // const file_types_url = OSPARC_SERVER + "v0/viewers/filetypes" // fix CORS issue
        const file_types_url = 'js/filetypes.json'
        fetch(file_types_url)
            .then(respFT => respFT.json())
            .then(filetypes => {
                populateTable(filesTable, filetypes["data"], tableData);
        });
});


const footer = createImage("resources/footer.png");
document.body.appendChild(footer);
