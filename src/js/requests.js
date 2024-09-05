import {
    saveUsersToStorage,
    renderUsers,
    renderErrorOption
} from './methods.js'

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) {
            const errorInstance = new Error(`Server Error: ${response.status}`)
            errorInstance.status = response.status
            throw errorInstance
        }
        const users = await response.json()
        saveUsersToStorage(users)
        renderUsers(users)
    }
    catch (error) {
        if (error.status) {
            renderErrorOption(`Request error: ${error.status}`)
        } else {
            console.warn(error)
            renderErrorOption(`Users can't be found, try again later...`)
        }
    }
}

export {
    getUsers
}