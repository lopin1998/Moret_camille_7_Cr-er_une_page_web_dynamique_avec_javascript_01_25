const loginForm = document.querySelector("form")

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value

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
        console.log(response)
        if(response.status != 200){
            alert("mot de passe ou email incorect")
            console.log("pas bon")
            throw new Error("coucou")
        }
        let data = await response.json()
        localStorage.setItem("keyT", data.token)
        window.location.href='/index.html'
    } catch (error) {
        console.log(error)
    }

})



