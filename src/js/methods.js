function generateUniqueId() {
    return crypto.randomUUID()
}

function getCurrentDate() {
    return new Date().toLocaleDateString('ru-RU')
}

function getColorClass(status) {
    switch (status) {
        case 'todo':
            return 'board__task_blue';
        case 'in-progress':
            return 'board__task_gray';
        case 'done':
            return 'board__task_green';
        default:
            return '';
    }
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks')
    return tasks ? JSON.parse(tasks) : []
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

export {
    generateUniqueId,
    getCurrentDate,
    getColorClass,
    saveTasksToStorage,
    getTasksFromStorage
}