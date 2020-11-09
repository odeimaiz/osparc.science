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
                    })
                    .catch(err => console.error("Can’t access json", err));
            })
            .catch(() => console.error("Can’t access BF"));

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
        "type":"File",
        "downloadUrl": "https://blackfynn-discover-use1.s3.amazonaws.com/84/1/files/template.json?AWSAccessKeyId=AKIAQNJEWKCFAOLGQTY6&Signature=8XQoMGyMXZ66h1SgUu4ZdnM5JGc%3D&x-amz-request-payer=requester&Expires=1604931672"
    }
];
populateTable(filesTable, tableData);


const footer = createImage("resources/footer.png");
document.body.appendChild(footer);
