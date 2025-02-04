let key = localStorage.getItem("keyT")


let btn = document.querySelector(".btn_class")

/* Les bouttons de filtres */
let catego = fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data_catego => {
        let display = '<button class="btn_class 0 btn_select" data-id="0">Tous</button>'
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
/* On suprime les fiches presente dynamiquement */
btnSupr.forEach(button =>
    button.addEventListener("click", (e) => {
        let url = ("http://localhost:5678/api/works/" + e.target.id)
        let option = {
            method: "DELETE",
            headers: { Authorization: `Bearer ${key}` }
        }

        fetch(url, option)
            .then(response => {
                let test = document.querySelector(`#work-modal-${e.target.id}`)
                console.log(test)
                test.remove()
                console.log(e.target.id)
                let figureHomePage = document.querySelector(`#work-${e.target.id}`)
                figureHomePage.remove()
            })
            .catch(e => {

            })

    })
)
/* Le bouttun pour revenir en arrière dans la modal */
document.querySelectorAll(".data-return").forEach(button =>
    button.addEventListener("click", (e) => {
        modal.querySelector(".ajout-photo").style.display = 'none'
        modal.querySelector(".galerie-photo").style.display = 'block'
    })
)
/* Le button pour fermer la modal qui rafiche la première page de la modal */
document.querySelectorAll(".data-close-modal").forEach(button =>
    button.addEventListener("click", (e) => {
        modal.querySelector(".galerie-photo").style.display = 'block'
        document.querySelector("body").style.overflow = 'auto'
        modal.close()
    })
)

modal.addEventListener('click', (e) => {
    if (e.target == modal) {
        document.querySelector("body").style.overflow = 'auto'
        modal.querySelector(".galerie-photo").style.display = 'block'
        modal.close()
    }
})

/* Ceci est le selecteur de categorie dans la modal ou on ajoute des fiches. */
let categoModal = fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data_catego => {
        let display = '<option class="opti" value="">--Selectioner une categorie--</option>'
        for (const figure of data_catego) {

            display += `<option class="opti" value="${figure.id}">${figure.name}</option>`

        }
        document.querySelector(".modal-catego").insertAdjacentHTML('afterbegin', display)


    })
    .catch(err => {

    })

const addModal = document.querySelector("form")
const ue = document.querySelector(".modal-catego")
document.getElementById("modalCatego").addEventListener('change', function () {

})



/* on ajoute des fiches */
addModal.addEventListener("submit", async (e) => {
    e.preventDefault()
    const image = addModal.inputFile.files[0]
    const titleFigure = addModal.titre.value
    const category = addModal.modalCatego.value
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
                    display4 = `<figure id="work-modal-${figure_works.id}" data-catego="${category}">
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
    if ((checkSizePicture() == true) && (checkTypePicture() == true)) {
        preview.src = URL.createObjectURL(file)
        document.querySelector(".fa-image").style.display = "none"
        document.querySelector(".addPhoto").style.display = "none"
        document.querySelector(".pPhoto").style.display = "none"
        document.querySelector(".labelFile").style.visibility = "visible"
    }

    const pictureSize = file.size /* kilobite 4.000.000*/
    const pictureType = file.type /* .jpg .png */
    console.log(pictureSize, pictureType)
    function checkSizePicture() {
        if (file.size > 4000000) {
            return false
        }
        else {
            return true
        }
    }
    function checkTypePicture() {
        if ((file.type == 'image/png') || (file.type == 'image/jpeg')) {
            return true
        }
        else {
            return false
        }

    }
}




/* Controle du form */
document.addEventListener("DOMContentLoaded", () => {
    const pictureForm = document.getElementById("pictureForm")
    const formModalSubmit = document.getElementById("formModalSubmit")
    const checkPictureFormValidity = () => {
        if (pictureForm.checkValidity()) {
            formModalSubmit.disabled = false
        }
        else {
            formModalSubmit.disabled = true
        }
    }
    pictureForm.addEventListener("input", checkPictureFormValidity)
    checkPictureFormValidity()
})