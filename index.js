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
        true: 5,
        false: 3
    };

    let rowLength = rowPattern[true];
    let r = 0;
    let row = createGalleryRow(rowLength);
    for (let i = 0; i < images.length; i++){
        if (r >= rowLength) {
            if (rowLength > images.length - i) { rowLength = images.length - i; }
            row = createGalleryRow(rowLength);
            r = 0;
        }

        let galleryItem = document.createElement("img");

        galleryItem.src = "./backend/images/" + images[i]["filename"];
        galleryItem.classList.add("gallery-item");
        galleryItem.onclick = (e) => { console.log("Ow!") }
        
        if (galleryItem.naturalHeight <= galleryItem.naturalWidth ){
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

async function searchFor(searchParams){
    let url = "http://www.localhost:4000/api/images/GetSomeImages?";

    let images = await fetch(url + new URLSearchParams({search: searchParams}));
    let data = images.json();
    return data;
}

async function fetchImages(){
    let images = await fetch("http://www.localhost:4000/api/images/GetAllImages/");
    let data = images.json();
    return data;
}

let images = []

fetchImages().then((_images) => {
    createGallery(_images);
    images = _images;
})

const searchInput = document.getElementById("SearchTextInput");

document.addEventListener("input", (e) => {
    searchFor(e.target.value).then((_images)=>{
        images = _images;
    })
});

document.addEventListener("change", (e) => {
    deleteGallery();
    createGallery(images);
});