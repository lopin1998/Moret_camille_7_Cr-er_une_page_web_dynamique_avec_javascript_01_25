let key = localStorage.getItem("keyT")


let btn = document.querySelector(".btn_class")

/* Les bouttons de filtres */
let catego = fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data_catego => {
        let display = '<button class="btn_class 0" data-id="0">Tout</button>'
        for (const figure of data_catego) {

            display += `<button class="btn_class ${figure.id}" data-id="${figure.id}">${figure.name}</button>`

        }
        document.querySelector(".filtres").insertAdjacentHTML('afterbegin', display)
        //let dataList = button
        let activeId = null
        document.querySelectorAll('.btn_class').forEach(button => {
            button.addEventListener('click', (e) => {
                let a = document.querySelectorAll(`[data-catego="${e.target.dataset.id}"]`)
                let b = document.querySelectorAll("[data-catego]")
                for (elem of b) {
                    //Suprime tout //
                    elem.style.display = 'none'
                    activeId = e.target.dataset.id
                    e.target.classList.add("btn_select")
                    if (e.target.dataset.id == 0) {
                        // si id est strictement egal a zero allort on affiche tout//
                        elem.style.display = 'grid'
                    }
                }
                for (elem of a) {
                    //sa affiche uniquement les ellements sellectionner par "a"//
                    elem.style.display = 'grid'
                }

                document.querySelectorAll('.btn_class').forEach(btn => {
                    if (btn.classList[1] != activeId) {
                        btn.classList.remove("btn_select")
                    }
                })

            })

        }

        )

    })
    .catch(err => {
        
    })

/* Toute les images afficher */
let works = fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(data_works => {
        let display1 = ''
        let display2 = ''
        for (let figure_works of data_works) {

            display1 += `<figure id="work-${figure_works.id}" data-catego="${figure_works.categoryId}">
                <img src="${figure_works.imageUrl}" alt="${figure_works.title}">
                <figcaption>${figure_works.title}</figcaption>
            </figure>`
            display2 += `<figure data-catego="${figure_works.categoryId}">
                <img src="${figure_works.imageUrl}" alt="${figure_works.title}">
                <figcaption>${figure_works.title}</figcaption>
                <i class="fa-regular fa-trash-can supr-btn" id="${figure_works.id}"></i>
            </figure>`
        }
        document.querySelector(".gallery").insertAdjacentHTML('afterbegin', display1)
        document.querySelector(".gallery_modal").insertAdjacentHTML('afterbegin', display2)

    })
    .catch(err => {
        
    })

/* key login */
let loginHeader = document.querySelector(".header_sommaire")
let bandeauxEdition = document.querySelector(".mode-edition")
let modalModifier = document.querySelector(".data-open-modal")
let logoutHeader = document.querySelector(".LogOut")
let BtnFiltre = document.querySelector(".filtres")

if (key) {
    loginHeader.style.display = "none"
    modalModifier.style.display = 'flex'
    bandeauxEdition.style.display = 'flex'
    logoutHeader.style.display = 'block'
    BtnFiltre.style.display = 'none'
    document.querySelector(".all-header-sommaire").style.margin = '110px 0'
}
else {
    modalModifier.style.display = 'none'
    bandeauxEdition.style.display = 'none'
    logoutHeader.style.display = 'none'
    BtnFiltre.style.display = 'flex'
}
/* lougout on remove la key pour passer de admin a utilisateur */
logoutHeader.addEventListener("click", () => {
    localStorage.removeItem("keyT");
    location.reload();
})



/* On recupère tout ce qu'il faut pour la modal */
const openButton = document.querySelector(".data-open-modal")
const modal = document.querySelector("dialog")
const addPicture = document.querySelector(".btn-add-picture")
const btnSupr = document.querySelectorAll(".gallery_modal")

/* Les event listener pour ouvrir et fermer la modal et changer de fenètres */
openButton.addEventListener("click", () => {
    modal.querySelector(".ajout-photo").style.display = 'none'
    document.querySelector("body").style.overflow = 'hidden'
    modal.showModal()
})

addPicture.addEventListener("click", () => {
    modal.querySelector(".galerie-photo").style.display = 'none'
    modal.querySelector(".ajout-photo").style.display = 'block'
})
/* La on suprime les fiche presente dynamiquement */
btnSupr.forEach(button =>
    button.addEventListener("click", (e) => {
        let url = ("http://localhost:5678/api/works/" + e.target.id)
        let option = {
            method: "DELETE",
            headers: { Authorization: `Bearer ${key}` }
        }

        fetch(url, option)
            .then(response => {
                let test = document.querySelector(`#work-${e.target.id}`)
                test.remove()
                e.target.parentNode.remove()
            })
            .catch(e => {
                
            })

    })
)
document.querySelectorAll(".data-return").forEach(button =>
    button.addEventListener("click", (e) => {
        modal.querySelector(".ajout-photo").style.display = 'none'
        modal.querySelector(".galerie-photo").style.display = 'block'
    })
)
document.querySelectorAll(".data-close-modal").forEach(button =>
    button.addEventListener("click", (e) => {
        modal.querySelector(".galerie-photo").style.display = 'block'
        document.querySelector("body").style.overflow = 'auto'
        modal.close()
    })
)

let categoModal = fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data_catego => {
        let display = '<option class="opti" value="">--Selectioner une categorie--</option>'
        for (const figure of data_catego) {

            display += `<option class="opti" id="ueue" value="${figure.id}">${figure.name}</option>`

        }
        document.querySelector(".modal-catego").insertAdjacentHTML('afterbegin', display)


    })
    .catch(err => {
        
    })

const addModal = document.querySelector("form")
const ue = document.querySelector(".modal-catego")
document.getElementById("ui").addEventListener('change', function () {

})



/* on ajoute des fiches */
addModal.addEventListener("submit", async (e) => {
    e.preventDefault()
    const image = addModal.inputFile.files[0]
    const titleFigure = addModal.titre.value
    const category = addModal.ui.value
    const formData = new FormData()
    formData.append("image", image)
    formData.append("title", titleFigure)
    formData.append("category", category)
    try {
        let postFigure = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${key}`
            },
            body: formData
        })
        /* La on mais la partie inser html quand on ajoute un ellement */
        postFigure = fetch("http://localhost:5678/api/works")
            .then(res => res.json())
            .then(data_Form => {
                let display3 = ''
                let display4 = ''
                for (let figure_works of data_Form) {

                    display3 = `<figure id="work-${figure_works.id}" data-catego="${category}">
                        <img src="${figure_works.imageUrl}" alt="${titleFigure}">
                        <figcaption>${titleFigure}</figcaption>
                    </figure>`
                    display4 = `<figure id="work-${figure_works.id}" data-catego="${category}">
                        <img src="${figure_works.imageUrl}" alt="${titleFigure}">
                        <figcaption>${titleFigure}</figcaption>
                        <i class="fa-regular fa-trash-can supr-btn" id="${figure_works.id}"></i>
                    </figure>`
                }
                document.querySelector(".gallery").insertAdjacentHTML('beforeend', display3)
                document.querySelector(".gallery_modal").insertAdjacentHTML('beforeend', display4)

            })

    } catch (error) {

    }
    try {
        document.querySelector(".labelFile").style.visibility = "hidden";
        document.querySelector(".fa-image").style.display = "block"
        document.querySelector(".addPhoto").style.display = "block"
        document.querySelector(".pPhoto").style.display = "block"
        document.querySelector(".btnForm").disabled = true
        addModal.reset();
        return false;
    } catch (error) {

    }
})

/* La on peut voir la precview */
inputFile.onchange = e => {
    const [file] = inputFile.files
    if (file) {
        preview.src = URL.createObjectURL(file)
        document.querySelector(".fa-image").style.display = "none"
        document.querySelector(".addPhoto").style.display = "none"
        document.querySelector(".pPhoto").style.display = "none"
        document.querySelector(".labelFile").style.visibility = "visible"
    }

}

/* Controle du form */
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm")
    const contactFormSubmit = document.getElementById("contactFormSubmit")

    const pictureForm = document.getElementById("pictureForm")
    const formModalSubmit = document.getElementById("formModalSubmit")
    const checkFormValidity = () => {
        if (contactForm.checkValidity()) {
            contactFormSubmit.disabled = false
        }
        else {
            contactFormSubmit.disabled = true
        }
    }
    const checkPictureFormValidity = () => {
        if (pictureForm.checkValidity()) {
            formModalSubmit.disabled = false
        }
        else {
            formModalSubmit.disabled = true
        }
    }
    contactForm.addEventListener("input", checkFormValidity)
    pictureForm.addEventListener("input", checkPictureFormValidity)
    checkFormValidity()
    checkPictureFormValidity()
})