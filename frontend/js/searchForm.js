import Gallery from "./gallery.js";
const backend_url = "/backend";

export default async function searchFor(searchQuery){
    let count = 0;
    for (const [key, value] of Object.entries(searchQuery)){
        if (value !== "") { break; }
        count += 1;
        if (count == 5) { return Gallery.fetchImages(30) }
    }

    let url = backend_url + "/images?";
    let images = await fetch(url + new URLSearchParams(searchQuery));
    let data = await images.json();
    
    return data;
}