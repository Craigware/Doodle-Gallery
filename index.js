backend_url = "http://127.0.0.1:8000"

function createGallery(images){
    function createGalleryRow(rowLength){
        let row = document.createElement("div");
        row.classList.add("gallery-row");
        row.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
        row.style.height = "20rem";
        row.style.overflow = "hidden";
        return row
    }
    const gallery = document.getElementById("Gallery");
    gallery.style.height = "";

    const rowPattern = {
        true: 7,
        false: 3
    };

    let placeHolder = 1;
    let rowLength = rowPattern[true];
    let r = 0;
    let row = createGalleryRow(rowLength);
    for (let i = 0; i < images.length; i++){
        if (r >= rowLength) {
            if (rowLength > images.length - i) { rowLength = images.length - i; }
            row = createGalleryRow(rowLength);
            r = 0;
        }

        const galleryItem = document.createElement("img");
        const resolution =  images[i]["imageSize"];
        const iSrc = "data:image/png;base64," + images[i]["image_base64"];

        galleryItem.src = iSrc;
        galleryItem.classList.add("gallery-item");

        galleryItem.onload = () => { this.loaded = true; }
        galleryItem.onclick = (e) => { showModal(e.target.src, images[i]); }

        if (resolution["y"] <= resolution["x"]){
            galleryItem.style.height = "100%";
            if (r+2 <= rowLength){
                galleryItem.style.gridColumn = `span 2`;
                r += 1;
            }
        }
        r += 1;
        row.appendChild(galleryItem);
        gallery.appendChild(row);
    }
}

function deleteGallery(){
    const gallery = document.getElementById("Gallery");
    gallery.innerHTML = "";
}

async function searchFor(searchQuery){
    count = 0;
    for (const [key, value] of Object.entries(searchQuery)){
        if (value !== "0") { break; }
        count += 1;
        if (count == 4) { return fetchImages() }
    }

    let url = backend_url + "/api/images/GetSomeImages?";
    let images = await fetch(url + new URLSearchParams(searchQuery));
    let data = images.json();
    return data;
}

async function fetchImages(){
    let images = await fetch(backend_url + "/api/images/");
    let data = images.json();
    return data;
}

function showModal(imagePath, image){
    const main = document.getElementsByTagName("html")[0];

    const modal = document.createElement("div");
    const background = document.createElement("div");
    const img = document.createElement("img");
    const imgContainer = document.createElement("div");
    const title = document.createElement("h2");

    const yOffset = window.scrollY;
    window.onscroll = () => { window.scrollTo(0,yOffset);};


    modal.onclick = () => {
        main.removeChild(main.children[main.children.length - 1]);
        window.onscroll = () => {};
    };
    
    modal.style.cssText = `
        cursor: pointer;
        position: absolute;
        height: 100vh;
        width: 100%;
        left: 0;
        top: ${yOffset}px;
    `;

    background.style.cssText = `
        position: absolute;
        background-color: black;
        height: 100%;
        width: 100%;
        opacity: 80%;
    `;

    img.src = imagePath;
    imgContainer.style.cssText = `
        position: absolute;
        opacity: 100%;
        width: 75%;
        height: 75%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    `;

    img.style.cssText = `
        object-fit: contain;
        width: 100%;
        height: 100%;
    `


    let createdOn = new Date(image["created"]);
    title.innerHTML = "<span style='text-decoration:underline;'>" + image["title"] + "</span>; " + createdOn.toLocaleDateString();
    console.log(image);
    title.style.cssText = `
        color: white;
        width: 100%;
        top: 2rem;
        text-align: center;
        position: absolute;
        font-size: 48px;
        z-index: 10;
    `;


    imgContainer.appendChild(img);
    
    modal.appendChild(imgContainer);
    modal.appendChild(title);
    modal.appendChild(background);
    main.appendChild(modal);
}

function updateSort(e){
}

let sort = "";
const searchQuery = {
    search: "",
    mediums: "",
    created: "",
    tags: ""
};
let images = []

window.addEventListener("load", () => {
    const searchForm = document.getElementById("SearchForm");

    fetchImages().then((_images) => {
        createGallery(_images);
        images = _images;
    })

    searchForm.addEventListener("change", (e) => {
        searchQuery[e.target.name] = e.target.value;
        searchFor(searchQuery).then((_images) => {
            images = _images;
            deleteGallery();
            createGallery(images);
         });
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });
});

