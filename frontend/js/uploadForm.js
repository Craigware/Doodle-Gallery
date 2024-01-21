import Gallery from "./gallery.js";
const backend_url = "/backend";

export async function submitUploadForm(event){
    event.preventDefault();

    let accessToken = document.cookie.split("=");
    accessToken = accessToken[accessToken.indexOf("api-access-token") + 1];

    const response = await fetch(backend_url + "/images/", {
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

    if (response.ok) {
        const inputs = event.target.children;
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }
}

export async function handleFormData(e) {
    const maxFileSize = 5 * 1048576;
    if (e.target.name == "filename") {
        if (e.target.files[0].size > maxFileSize ) { alert("File upload too large."); e.target.value = ""; return null; }
        data[e.target.name] = e.target.files[0].name;

        let file = e.target.files[0];

        const reader = new FileReader();

        reader.addEventListener("load", async (e) => {
            data["base_64"] = reader.result;

            let uploadedImage = new Image();
            uploadedImage.src = reader.result;
            uploadedImage.onload = () => {
                let orientation = (uploadedImage.height >= uploadedImage.width) ? "portrait" : "landscape";
                data["orientation"] = orientation;
            }
        });
        reader.readAsDataURL(file);
    } else {
        data[e.target.name] = e.target.value;
    }

    console.log(data);
}

const data = {};
