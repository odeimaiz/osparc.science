function create_image(src, width, height, alt) {
    const img = document.createElement("img");
    img.src = src;
    // img.width = width;
    // img.height = height;
    // img.alt = alt;
    return img;
}

const header = create_image("/resources/header.png");
document.body.appendChild(header);

const footer = create_image("/resources/footer.png");
document.body.appendChild(footer);
