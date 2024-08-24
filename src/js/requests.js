function getUsers() {
    fetch('https://jsonplaceholder.typicode.com/users/1234')
        .then((response) => {
            if (!response.ok) {
                const errorInstance = new Error(`Server Error: ${response.status}`)
                errorInstance.status = response.status
                throw errorInstance
                
            }
            return response.json()
        })
        .then((users) => {
            renderUsers(users)
        })
        .catch((error) => {
            if(error.status) {
                renderErrorOption(`Request error: ${error.status}`)
            } else {
                console.warn(error)
                renderErrorOption(`Users can't be found, try again later...`)
            }
        })
}

function renderUsers(users) {
    const selectElement = document.querySelector('#addTaskUser')

    users.forEach((user) => {
        const userElement = document.createElement('option')
        selectElement.insertAdjacentElement('beforeend', userElement)
        userElement.setAttribute('value', user.id)
        userElement.textContent = user.name
    })
}

function renderErrorOption(message) {
    const selectElement = document.querySelector('#addTaskUser')
    const errorElement = document.createElement('option')
    errorElement.textContent = message
    errorElement.disabled = true
    selectElement.insertAdjacentElement('beforeend', errorElement)
}
export {
    getUsers
}