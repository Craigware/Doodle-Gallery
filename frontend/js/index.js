class Gallery{
    static getImageMeta = (url) => 
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url
    });


    static async createGallery(images){
        function createGalleryRow(rowLength){
            let row = document.createElement("div");
            row.classList.add("gallery-row");
            row.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
            row.style.height = "480px";
            row.style.overflow = "hidden";
            return row
        }
        const gallery = document.getElementById("Gallery");
        gallery.style.height = "";
    
        const rowPattern = {
            true: 5,
            false: 3,
            desktop: (5, 3),
            mobile: (1, 1),
            tablet: (3, 2)
        };
        
        let currentPattern = true;
        let rowLength = rowPattern[currentPattern];
        let row = createGalleryRow(rowLength);
    
        let r = 0;
        for (let i = 0; i < images.length; i++){
            if (r >= rowLength) {
                currentPattern = !currentPattern;
                rowLength = rowPattern[currentPattern];
                if (rowLength > images.length - i) { rowLength = images.length - i; }
                row = createGalleryRow(rowLength);
                r = 0;
            }
    
            const iSrc = backend_url + "/api/images/" + `${images[i]["id"]}?file=true`;
            const galleryItem = await this.getImageMeta(iSrc);
    
            galleryItem.classList.add("gallery-item");
    
            galleryItem.onclick = (e) => { showModal(e.target.src, images[i]); }
            galleryItem.style.height = "100%";
    
            
            if (galleryItem.naturalHeight <= galleryItem.naturalWidth){
                if (r+2 <= rowLength){
                    galleryItem.style.gridColumn = `span 2`;
                    r += 1;
                }
            };
            r += 1;
            row.appendChild(galleryItem);
            gallery.appendChild(row);
        }
    }

    static deleteGallery(){
        const gallery = document.getElementById("Gallery");
        gallery.innerHTML = "";
    }
}


class modals{
    static removeExistingModals(){ // returns boolean on if something was deleted
        const modals = document.getElementsByClassName("modal");
        let count = 0;
        for (let i = 0; i < modals.length; i++){
            count += 1
            modals[i].remove();
        }

        return count > 0;
    }

    static createBackground(){
        const background = document.createElement("div");

        background.style.cssText = `
            position: absolute;
            background-color: black;
            height: 100%;
            width: 100%;
            opacity: 80%;
        `;
        
        background.onclick = () => {
            window.onscroll = () => {};
        };

        return background;
    }

    static createModal(){
        const modal = document.createElement("div");
        const yOffset = window.scrollY;

        window.onscroll = () => { window.scrollTo(0,yOffset);};

        modal.classList.add("modal");

        modal.style.cssText = `
            cursor: pointer;
            position: absolute;
            height: 100vh;
            width: 100%;
            left: 0;
            top: ${yOffset}px;
        `;

        modal.onclick = () => {
            this.removeExistingModals();
            window.onscroll = () => {};
        };

        return modal;
    }
}

function adminLoginModal(){
    modals.removeExistingModals();

    const main = document.getElementsByTagName("main")[0];
    const modal = modals.createModal();
    const background = modals.createBackground();
    
    const form = document.createElement("form");
    form.id = "Admin-Login";
    form.onsubmit = (e) => { e.preventDefault(); adminLogin(pwd) };


    const inp = document.createElement("input");
    inp.id = "pwd";
    inp.onchange = (e) => { pwd = e.target.value }
    inp.type = "password";
    inp.placeholder = "Admin Login";
    form.style.cssText = `
        position: absolute;
        z-index: 100;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `

    form.appendChild(inp);
    modal.appendChild(form);
    modal.appendChild(background);
    main.appendChild(modal);
}

function showModal(imagePath, image){
    modals.removeExistingModals();
    const main = document.getElementsByTagName("html")[0];
    const background = modals.createBackground();
    const modal = modals.createModal();

    const img = document.createElement("img");
    const imgContainer = document.createElement("div");
    const title = document.createElement("h2");

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

async function submitUploadForm(event){
    event.preventDefault();

    let accessToken = document.cookie.split("=");
    accessToken = accessToken[accessToken.indexOf("api-access-token") + 1];

    const response = await fetch(backend_url + "/api/images/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Api-Access-Token": accessToken
        },
        redirect: "follow",
        credentials: "same-origin",
        body: JSON.stringify(data),
    });
}

async function handleFormData(e) {
    const maxFileSize = 5 * 1048576;
    if (e.target.name == "filename") {
        if (e.target.files[0].size > maxFileSize ) { alert("File upload too large."); e.target.value = ""; return null; }
        data[e.target.name] = e.target.files[0].name;

        let file = e.target.files[0]
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            data["base_64"] = reader.result;
        });

        await reader.readAsDataURL(file);
    } else {
        data[e.target.name] = e.target.value;
    }
}

async function searchFor(searchQuery){
    count = 0;
    for (const [key, value] of Object.entries(searchQuery)){
        if (value !== "0") { break; }
        count += 1;
        if (count == 4) { return fetchImages() }
    }

    let url = backend_url + "/api/images/?";
    let images = await fetch(url + new URLSearchParams(searchQuery));
    let data = await images.json();
    return data;
}

async function fetchImages(){
    let images = await fetch(backend_url + "/api/images/");
    let data = await images.json();
    return data;
}

async function adminLogin(pass){
    const data = {"pwd": pass}
    let res = await fetch(backend_url + "/api/admin/login/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const response = await res.json();
        if (response["Token"] != undefined){
            document.cookie = `api-access-token=${response["Token"]}`;
            const main = document.getElementsByTagName("main")[0];
            main.removeChild(main.children[main.children.length - 1]);
            window.onscroll = () => {}
        } else {
            console.log("Bad password");
        }
    } else {
        console.log("error");
    }
}

function adminCheck(uploadForm){
    if (admin){
        uploadForm.innerHTML = `
            <input type="text" onchange="handleFormData(event)" placeholder="Title" name="title" />
            <input type="file" onchange="handleFormData(event)" accept=".png, .jpg" placeholder="Image" name="filename"/>
            <input type="text" onchange="handleFormData(event)" placeholder="Tags" name="tags"/>
            <input type="text" onchange="handleFormData(event)" placeholder="Mediums" name="mediums"/>
            <input type="date" onchange="handleFormData(event)" name="created"/>
            <button>Upload</button>
        `;
    }
}
const backend_url = "http://0.0.0.0:8000";
const data = {};
const searchQuery = {
    search: "",
    mediums: "",
    created: "",
    tags: ""
};

let images = []
let sort = "";
let pwd = null;

const accessToken = document.cookie.split("=");
const admin = accessToken[accessToken.indexOf("api-access-token") + 1] != undefined;

window.addEventListener("load", () => {
    const searchForm = document.getElementById("SearchForm");
    const uploadForm = document.getElementById("UploadDoodleForm");
    console.log("!!!");
    adminCheck(uploadForm);

    fetchImages().then((_images) => {
        Gallery.createGallery(_images);
        images = _images;
    })

    searchForm.addEventListener("change", (e) => {
        searchQuery[e.target.name] = e.target.value;

        searchFor(searchQuery).then((_images) => {
            images = _images;
            Gallery.deleteGallery();
            Gallery.createGallery(images);
        });
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });
});

