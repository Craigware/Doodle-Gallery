import { submitUploadForm, handleFormData } from "./uploadForm.js";

export default class Modals{
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
            this.removeExistingModals();
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

        return modal;
    }


    static showAdminLoginModal(){
        async function adminLogin(pass){
            const data = {"pwd": pass}
            let res = await fetch(backend_url + "/admin/login/", {
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
                    return true;
                } else {
                    console.log("Bad password");
                    return false;
                }
            } else {
                return false;
            }
        }
        
        Modals.removeExistingModals();
    
        const main = document.getElementsByTagName("main")[0];
        const modal = Modals.createModal();
        const background = Modals.createBackground();
        
        const form = document.createElement("form");
        form.id = "Admin-Login";
        form.onsubmit = async (e) => { e.preventDefault(); let passed = await adminLogin(pwd); if (passed) { window.location.reload(); } };
    
    
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


    static showImgModal(imagePath, image){
        Modals.removeExistingModals();
        const main = document.getElementsByTagName("html")[0];
        const background = Modals.createBackground();
        const modal = Modals.createModal();
    
        modal.onclick = () => {
            Modals.removeExistingModals();
            window.onscroll = () => {};
        };
    
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
    
        let date = image["created"].split("-")
        title.innerHTML = "<span style='text-decoration:underline;'>" + image["title"] + "</span>; " + date[1] + "/" + date[2] + "/" + date[0];
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


    static showUploadModal(){
        Modals.removeExistingModals();
    
        const main = document.getElementsByTagName("main")[0];
        const modal = Modals.createModal();
        const background = Modals.createBackground();
        
        const form = document.createElement("form");
        form.id = "UploadDoodleForm";
        form.onsubmit = (e) => { submitUploadForm(e); }
    
        form.innerHTML = `
            <input type="text" placeholder="Title" name="title" />
            <input type="text" placeholder="Tags" name="tags"/>
            <input type="text" placeholder="Mediums" name="mediums"/>
            <input type="date"name="created"/>
            <input type="file" accept=".jpg, .jpeg" placeholder="Image" name="filename"/>
            <button>Upload</button>
        `

        for (let i = 0; i < form.children.length - 1; i++)
        {
            form.children[i].onchange = handleFormData;
        }

        form.style.cssText = `
            position: relative;
            width: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.315);
            border-radius: 2rem;
            padding: 2rem;
        `
    
        for (let i = 0; i < form.children.length; i++) {
            form.children[i].style.cssText = `
                opacity: 100%;
                display: block;
                width: 100%;
                margin: 1rem 0;
                align-items: center;
                vertical-align: middle;
            `;
        }
    
        modal.appendChild(background);
        modal.appendChild(form);
        main.appendChild(modal);
    }
}
