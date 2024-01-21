import Modals from "./modals.js";

const backend_url = "/backend";

export default class Gallery{
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
    
        const rowPatterns = {
            "desktop": [5, 3],
            "mobile": [1, 1],
            "tablet": [3, 2]
        };
        
        // Swapping pattern
        let currentPattern = null;
        switch (true) {
            // Desktop
            case (window.innerWidth >= 1080):
                currentPattern = "desktop"
                break;
            // Tablet
            case (window.innerWidth >= 720):
                currentPattern = "tablet"
                break;
            // Mobile
            case (window.innerWidth < 720):
                currentPattern = "mobile"
                break;
        }

        let rowLengths = rowPatterns[currentPattern];
        let currLen = 0;


        let row = createGalleryRow(rowLengths[currLen]);
        let r = 0;
        for (let i = 0; i < images.length; i++){
            if (r >= rowLengths[currLen]) {
                if (currLen == 0) { currLen = 1; } else { currLen = 0; }
                if (rowLengths[currLen] > images.length - i) { rowLengths[currLen] = images.length - i; }
                row = createGalleryRow(rowLengths[currLen]);
                r = 0;
            }
            
            const iSrc = backend_url + "/images/" + `${images[i]["id"]}?file=true&compressed=true`;
            const galleryItem = await this.getImageMeta(iSrc);
    
            galleryItem.classList.add("gallery-item");
    
            galleryItem.onclick = (e) => { Modals.showImgModal(e.target.src, images[i]); }
            galleryItem.style.height = "100%";
    
            
            if (galleryItem.naturalHeight <= galleryItem.naturalWidth){
                if (r+2 <= rowLengths[currLen]){
                    galleryItem.style.gridColumn = `span 2`;
                    r += 1;
                }
            };
            r += 1;
            row.appendChild(galleryItem);
            gallery.appendChild(row);
        }
        gallery.style.height = "auto";
    }

    static deleteGallery(){
        const gallery = document.getElementById("Gallery");
        gallery.innerHTML = "";
    }

    static async fetchImages(){
        let images = await fetch(backend_url + "/images?range_start=0&range_end=30");
        let data = await images.json();
        console.log(data);
        return data;
    }
}