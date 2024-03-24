import Gallery from "./gallery.js";
const backend_url = "/backend";

export class SortStyles {
  static default = "default";
  static created = "created";
}

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

function partition(array, sortOption, low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    let a = array[j][sortOption];
    let b = pivot[sortOption];

    if (sortOption == SortStyles.created) {
      a = new Date(array[j][sortOption]);
      b = new Date(pivot[sortOption]);
    }

    if (a <= b) {
      i++;
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  let temp = array[i+1];

  array[i+1] = array[high];
  array[high] = temp;

  return i+1;
}

export function quickSortImages(array, sortOption, low=0, high=null){
  if (high == null) {
    high = array.length - 1;
  }

  if (low < high) {
    let pivot = partition(array, sortOption, low, high);
    quickSortImages(array, sortOption, low, pivot-1);
    quickSortImages(array, sortOption, pivot+1, high);
  }
}
