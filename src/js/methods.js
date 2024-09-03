import {
    buildTemplateTask,
    buildTemplateTime
} from './templates.js'


//Utility methods
function generateUniqueId() {
    return crypto.randomUUID()
}

function getCurrentDate() {
    return new Date().toLocaleDateString('ru-RU')
}

function getCurrentTime() {
    const currentDate = new Date()

    const currentHours = String(currentDate.getHours()).padStart(2, '0')
    const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0')
    const currentSeconds = String(currentDate.getSeconds()).padStart(2, '0')

    const timeElement = document.querySelector('.header__time-wrapper')

    timeElement.innerHTML = ''
    timeElement.insertAdjacentHTML('afterbegin', buildTemplateTime(currentHours, currentMinutes, currentSeconds))
}

function getColorClass(status) {
    switch (status) {
        case 'todo':
            return 'board__task_blue'
        case 'in-progress':
            return 'board__task_gray'
        case 'done':
            return 'board__task_green'
        default:
            return ''
    }
}

//Storage methods
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

//Render methods
function render(tasks) {
    const todoBlock = document.querySelector('.board__tasks-todo')
    const progressBlock = document.querySelector('.board__tasks-progress')
    const doneBlock = document.querySelector('.board__tasks-done')
    todoBlock.innerHTML = ''
    progressBlock.innerHTML = ''
    doneBlock.innerHTML = ''

    const sortedTasks = tasks.sort((a, b) => new Date(a.movedAt) - new Date(b.movedAt)) //sorting tasks by move time
    showEmptyListMessage(tasks, todoBlock)

    sortedTasks.forEach(({ title, description, userId, createdAt, colorClass, taskId, status }) => {
        const userList = getUsersFromStorage()
        const userName = userList.find((user) => user.id == userId).name //look in the array for the user object whose ID is equal to the value of userID from the task object
        const taskHTML = buildTemplateTask({ title, description, userId: userName, createdAt, colorClass, taskId }) //replace user with userName

        if (status == 'todo') {
            todoBlock.insertAdjacentHTML('beforeend', taskHTML)
        } else if (status == 'in-progress') {
            progressBlock.insertAdjacentHTML('beforeend', taskHTML)
        } else if (status == 'done') {
            doneBlock.insertAdjacentHTML('beforeend', taskHTML)
        }
    })

    toggleDeleteAllButton(tasks)
    updateTaskCount(tasks)
}

function updateTaskCount(tasks) {
    const todoTaskCounter = document.querySelector('.board__column-counter-todo')
    const progressTaskCounter = document.querySelector('.board__column-counter-progress')
    const doneTaskCounter = document.querySelector('.board__column-counter-done')

    todoTaskCounter.innerHTML = tasks.filter(task => task.status == 'todo').length
    progressTaskCounter.innerHTML = tasks.filter(task => task.status == 'in-progress').length
    doneTaskCounter.innerHTML = tasks.filter(task => task.status == 'done').length

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
    render,
    getCurrentTime,
    updateTaskCount,
    showEmptyListMessage,
    toggleDeleteAllButton
}