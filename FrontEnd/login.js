const loginForm = document.querySelector("form")

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    let patern = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm
    let result = patern.test(email)
    /* ajouter de verification pour email et pasword et ajouter une regex 101 pour email */
    if (result == true) {
        try {
            let response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,

                })
            })
            if (response.status != 200) {
                alert("mot de passe ou email incorect")
                throw new Error()
            }
            let data = await response.json()
            localStorage.setItem("keyT", data.token)
            window.location.href='index.html'
        } catch (error) {

        }
    }
    else{
        alert("veuillez saisir une adresse mail conforme ex: test1234@test.fr")
    }

})
