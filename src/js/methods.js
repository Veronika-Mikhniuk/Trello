function generateUniqueId() {
    return crypto.randomUUID()
}

function getCurrentDate() {
    return new Date().toLocaleDateString('ru-RU')
}

export {
    generateUniqueId,
    getCurrentDate
}