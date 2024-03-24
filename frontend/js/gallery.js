import Modals from "./modals.js";
import { quickSortImages, SortStyles } from "./searchForm.js";

const backend_url = "/backend";

export default class Gallery{
    static rowPatterns = {
        "desktop": [5, 3],
        "mobile": [1, 1],
        "tablet": [3, 2]
    };

    static getImageMeta = (url) => 
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url
    });

    static getDeviceByScreenSize()
    {
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

      return currentPattern
    }

    static async createGallery(images){     
        let currentPattern = this.getDeviceByScreenSize();
        
        let rowLengths = this.rowPatterns[currentPattern];
        let currLen = 0;

        let row = this.createGalleryRow(rowLengths[currLen]);
        
        await this.appendRowsToGallery(row, images, currLen, rowLengths);
    }

    static createGalleryRow(rowLength){
      let row = document.createElement("div");
      row.rowLength = rowLength;
      row.classList.add("gallery-row");
      row.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`
      row.style.height = "480px";
      row.style.overflow = "hidden";
      return row
    }

    static async appendRowsToGallery(startingRow, images, currLen, rowLengths, r = 0) {
      const gallery = document.getElementById("Gallery");
      let row = startingRow;
      if (row.parentElement != gallery) { gallery.appendChild(row); }

      for (let j = 0; j < images.length; j++){
        if (r >= rowLengths[currLen]) {
            if (currLen == 0) { currLen = 1; } else { currLen = 0; }
            row = this.createGalleryRow(rowLengths[currLen]);
            gallery.appendChild(row);
            r = 0;
        }

        r = await this.addImageToGallery(row, images[j], r, rowLengths[currLen]);
      }
    }

    static async addToGallery(images){
      const gallery = document.getElementById("Gallery");
      let row = gallery.children[gallery.children.length - 1];

      let r = 0;
      for (let i = 0; i < row.children.length; i++)
      {
        if (row.children[i].style.gridColumn != "") { r++; }
        r++;
      }

      let currentPattern = this.getDeviceByScreenSize();
      let currLen = this.rowPatterns[currentPattern].indexOf(row.rowLength);
      let rowLengths = this.rowPatterns[currentPattern];

      if (r == row.rowLength) {
        if (currLen == 0) { currLen = 1; } else { currLen = 0; }
        row = this.createGalleryRow(rowLengths[currLen]);
        r = 0;
      }

      await this.appendRowsToGallery(row, images, currLen, rowLengths, r);
    }

    static deleteGallery(images){
      const gallery = document.getElementById("Gallery");
      gallery.innerHTML = "";
    }

    static async addImageToGallery(row, image, rowPosition, rowLength){
      const iSrc = backend_url + "/images/" + `${image["id"]}?file=true&compressed=true`;
      const galleryItem = await this.getImageMeta(iSrc);
      galleryItem.alt = image["description"];

      galleryItem.classList.add("gallery-item");

      galleryItem.onclick = (e) => { Modals.showImgModal(e.target.src, image); }
      galleryItem.style.height = "100%";

      
      if (image["orientation"] == "landscape"){
        if (rowPosition+2 <= rowLength){
          galleryItem.style.gridColumn = `span 2`;
          rowPosition += 1;
        }
      };

      rowPosition += 1;
      row.appendChild(galleryItem);
    
      return rowPosition;
    }

    static async fetchImages(amount = 30){
        let images = await fetch(backend_url + `/images?range_start=0&range_end=${amount}`);
        let data = await images.json();
        data = data.reverse();
        return data;
    }

    static async loadMore(searchQuery, lastRangeEnd, grabAmount){

      const newQuery = {
        range_start: lastRangeEnd,
        range_end: lastRangeEnd + grabAmount,
        ...searchQuery
      }

      let url = backend_url + "/images?";

      let images = await fetch(url + new URLSearchParams(newQuery));
      let data = await images.json();
      await this.addToGallery(data);

      return data;
    }
}
