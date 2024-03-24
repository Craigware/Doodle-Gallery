import Gallery from "./gallery.js";
import Modals from "./modals.js";
import searchFor, { quickSortImages } from "./searchForm.js";

function getCookies(){
    const cookieString = document.cookie;
    const cookieSeparated = cookieString.split(";");
    const cookies = {};

    for (let i = 0; i < cookieSeparated.length; i ++){
        const keyVal = cookieSeparated[i].split("=");
        cookies[keyVal[0]] = keyVal[1];
    }

    return cookies;
}

const cookies = getCookies();
const admin = cookies["api-access-token"] != undefined;
const searchQuery = {
    search: "",
    mediums: "",
    created: "",
    tags: "",
};

let images = []
let sort = "";
let pwd = null;

window.addEventListener("load", () => {
    const searchForm = document.getElementById("SearchForm");
    const sortForm = document.getElementById("SortForm");
    const footer = document.getElementById("Sticky-Footer");
    const adminOption = footer.children[0];


    if (admin){
        adminOption.innerHTML = "Upload Image";
        adminOption.onclick = Modals.showUploadModal;
    } else {
        adminOption.innerHTML = "Admin Login";
        adminOption.onclick = Modals.showAdminLoginModal;
    }

    Gallery.fetchImages(30).then((_images) => {
        Gallery.createGallery(_images);
        images = _images;
        console.log(images);
    })

    searchForm.addEventListener("change", (e) => {
        searchQuery[e.target.name] = e.target.value;

        images = searchFor(searchQuery).then((_images) => {
            images = _images;
            Gallery.deleteGallery();
            Gallery.createGallery(images);
        });
    });

    sortForm.addEventListener("change", (e) => {
      let sortStyle = e.target.value;
      quickSortImages(images, sortStyle);
      images = images.reverse();
      Gallery.deleteGallery();
      Gallery.createGallery(images);
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });
});

let acceptingResize = true;
let windowWidth = window.innerWidth;
async function resizeWindow(e){
    if (acceptingResize && windowWidth != window.innerWidth) {
        acceptingResize = false;

        Gallery.deleteGallery();
        await Gallery.createGallery(images)
        windowWidth = window.innerWidth;
        acceptingResize = true;
    }
}

window.addEventListener("resize", resizeWindow);

const loadMore = document.getElementById("LoadMore"); 
loadMore.addEventListener("click", async (e) => { 
  let newImages = await Gallery.loadMore(searchQuery, images.length+1, 5);
  newImages = newImages.reverse();
  images = images.concat(newImages);
});
