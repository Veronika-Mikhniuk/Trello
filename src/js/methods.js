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

function getUsersFromStorage() {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function saveUsersToStorage(users) {
    localStorage.setItem('users', JSON.stringify(users))
}

function showEmptyListMessage(tasks, block) {
    if (tasks.length == 0) {
        block.innerHTML = '<div class="board__empty-list">Empty List</div>'
    }
}

function toggleDeleteAllButton(tasks) {
    doneTasks = tasks.filter(task => task.status =='done')
    const deleteAllButtonElement = document.querySelector('.board__delete-button')

    if (doneTasks.length > 0) {
        deleteAllButtonElement.classList.remove('d-none')
    } 
    else {
        deleteAllButtonElement.classList.add('d-none')
    }
}

export {
    generateUniqueId,
    getCurrentDate,
    getColorClass,
    saveTasksToStorage,
    getTasksFromStorage,
    saveUsersToStorage,
    getUsersFromStorage,
    showEmptyListMessage,
    toggleDeleteAllButton
}