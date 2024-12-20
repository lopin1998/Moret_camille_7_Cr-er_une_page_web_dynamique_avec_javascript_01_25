let key = localStorage.getItem("keyT")
console.log(key)
    


//insertAdjacentHTML



let btn = document.querySelector(".btn_class")



/* Les bouttons de filtres */
let catego = fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data_catego => {
        let display = '<button class="btn_class" data-id="0">Tout</button>'
        for (const figure of data_catego) {

            display += `<button class="btn_class" data-id="${figure.id}">${figure.name}</button>`
   
        }
        document.querySelector(".filtres").insertAdjacentHTML('afterbegin', display)
        //let dataList = button
        document.querySelectorAll('.btn_class').forEach(button =>
            button.addEventListener('click', (e) => {
                let a = document.querySelectorAll(`[data-catego="${e.target.dataset.id}"]`)
                let b = document.querySelectorAll("[data-catego]")
                for(elem of b){
                    //Suprime tout //
                    elem.style.display = 'none'
                    if(e.target.dataset.id == 0)
                        // si id est strictement egal a zero allort on affiche tout//
                        elem.style.display = 'grid'
                        button.classList.add("btn_select")   
                }
                for(elem of a){
                    //sa affiche uniquement les ellements sellectionner par "a"//
                    elem.style.display = 'grid'
                    button.classList.add("btn_select")
                }
                console.log(button)
                console.log(a)
                console.log(e.target.dataset.id)                
            }
            ))

    })
    .catch(err => {
        console.log('marche pas')
        console.log(err)
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
        console.log('dans le catch')
        console.log(err)
    })

/* key login */
let loginHeader = document.querySelector(".header_sommaire")
let bandeauxEdition = document.querySelector(".mode-edition")
let modalModifier = document.querySelector(".data-open-modal")
let logoutHeader = document.querySelector(".LogOut") 
console.log(key)
if(key){
    loginHeader.style.display = "none"
    modalModifier.style.display = 'flex'
    bandeauxEdition.style.display = 'flex'
    logoutHeader.style.display = 'block'
}
else {
    modalModifier.style.display = 'none'
    bandeauxEdition.style.display = 'none'
    logoutHeader.style.display = 'none'
}



/* On recupère tout ce qu'il faut pour la modal */
const openButton = document.querySelector(".data-open-modal")
const modal = document.querySelector("dialog")
const addPicture = document.querySelector(".btn-add-picture")
const btnSupr = document.querySelectorAll(".gallery_modal")

/* Les event listener pour ouvrir et fermer la modal et changer de fenètres */
openButton.addEventListener("click", () => {
    modal.querySelector(".ajout-photo").style.display = 'none'
    modal.showModal()
})

addPicture.addEventListener("click", () => {
    modal.querySelector(".galerie-photo").style.display = 'none'
    modal.querySelector(".ajout-photo").style.display = 'block'
})
/* La on suprime les fiche presente dynamiquement */
btnSupr.forEach(button =>
    button.addEventListener("click", (e) => {
        let url = ("http://localhost:5678/api/works/"+ e.target.id)
        let option = {
            method: "DELETE",
            headers: {Authorization: `Bearer ${key}`}
        }

        fetch(url, option)
            .then(response => {
                let test = document.querySelector(`#work-${e.target.id}`)
                console.log(test)
                test.remove()
                e.target.parentNode.remove()
            })
            .catch(e => {
                console.log(e)
            })
                
        console.log(url)
    })
)

document.querySelectorAll(".data-close-modal").forEach(button =>
    button.addEventListener("click", (e) => {
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
        console.log('dans le catch')
        console.log(err)
    })

const addModal = document.querySelector("form")
const ue = document.querySelector(".modal-catego")
document.getElementById("ui").addEventListener('change', function() {
    console.log("j'ai cliqué sur ", this.value)
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
    console.log(addModal.inputFile)
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
                let display = ''
                console.log(data_Form)
                for (let figure_works of data_Form) {
                    
                    display = `<figure id="work-${figure_works.id}" data-catego="${category}">
                        <img src="${figure_works.imageUrl}" alt="${titleFigure}">
                        <figcaption>${titleFigure}</figcaption>
                    </figure>`
                }
                document.querySelector(".gallery").insertAdjacentHTML('beforeend', display)
        })

    } catch (error) {
        console.log(error)
    }
})

/* document.addEventListener('DOMContentLoaded', function(){
    var form = document.getElementsByClassName('addForm');
    var submitButton = document.getElementById('formModalDubmit');

    form.addEventListener('input', function(){
        if (form.checkValidity()) {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "green";
        }else {
            submitButton.disabled = true
        }
    })
}) */

/* La on peut voir la precview */
inputFile.onchange = e => {
    const [file] = inputFile.files
    if(file) {
        preview.src = URL.createObjectURL(file)
    }
}

/* Controle du form */

checkForm =document.querySelector(".addForm")
console.log(checkForm)
