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
        console.log(images[i]);
        if (r >= rowLength) {
            if (rowLength > images.length - i) { rowLength = images.length - i; }
            row = createGalleryRow(rowLength);
            r = 0;
        }

        const galleryItem = document.createElement("img");
        const resolution =  images[i]["imageSize"];

        galleryItem.src = "./backend/images/" + images[i]["filename"];
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

    let url = "http://www.localhost:4000/api/images/GetSomeImages?";
    let images = await fetch(url + new URLSearchParams(searchQuery));
    let data = images.json();
    return data;
}

async function fetchImages(){
    let images = await fetch("http://www.localhost:4000/api/images/GetAllImages/");
    let data = images.json();
    return data;
}

function showModal(imagePath, image){
    const modal = document.createElement("div");
    const background = document.createElement("div");
    const img = document.createElement("img");
    const main = document.getElementsByTagName("main")[0];

    const offsetX = image["imageSize"]["x"] / 2;
    const offsetY = image["imageSize"]["y"] / 2;
    
    modal.style.cssText = `
        position: absolute;
        height: 100vh;
        width: 100%;
        left: 0;
        top: 0;
    `;

    background.onclick = () => {main.removeChild(main.children[main.children.length - 1])};
    background.style.cssText = `
        position: absolute;
        background-color: black;
        height: 100%;
        width: 100%;
        opacity: 50%;
    `;

    img.src = imagePath;
    img.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-${offsetX}px, -${offsetY}px);
        opacity: 100%;
    `;

    
    
    modal.appendChild(background);
    modal.appendChild(img);
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
    const searchInput = document.getElementById("SearchTextInput")
    const searchForm = document.getElementById("SearchForm");

    fetchImages().then((_images) => {
        createGallery(_images);
        images = _images;
    })

    searchForm.addEventListener("change", (e) => {
        searchQuery[e.target.name] = e.target.value;
        searchFor(searchQuery).then((_images) => {
            console.log(_images);
            images = _images;
            deleteGallery();
            createGallery(images);
         });
    });
})

