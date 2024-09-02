import { Modal } from 'bootstrap'
import { Task } from './models.js'
import { getColorClass, saveTasksToStorage, getTasksFromStorage, getUsersFromStorage } from './methods.js'
import { getUsers } from './requests.js'

// Variables------------------------------------------------------------------
//Modals
const addTaskModalElement = document.querySelector('#addTaskModal')
const editTaskModalElement = document.querySelector('#editTaskModal')
const deleteTasksModalElement = document.querySelector('#deleteConfirmationModal')
const taskLimitModalElement = document.querySelector('#taskLimitModal')

const addTaskModal = new Modal(addTaskModalElement) //Инициализация модального окна чтоб были доступны его методы
const editTaskModal = new Modal(editTaskModalElement)
const deleteConfirmationModal = new Modal(deleteTasksModalElement)
const limitWarningModal = new Modal(taskLimitModalElement)

//Other variables
const addTaskFormElement = document.querySelector('#addTaskForm')
const editTaskFormElement = document.querySelector('#editTaskForm')
const tasksBlock = document.querySelector('.board')
const deleteConfirmationButtonElement = document.querySelector('#deleteTasksConfirm')

// Add event listeners------------------------------------------------------------------
addTaskFormElement.addEventListener('submit', handleSubmitFormAddTask)
editTaskFormElement.addEventListener('submit', handleSubmitFormEditTask)
addTaskModalElement.addEventListener('hidden.bs.modal', handleCloseModalAddTask)
tasksBlock.addEventListener('click', handleClickWrapperTasks)
deleteConfirmationButtonElement.addEventListener('click', handleClickButtonDeleteDone)


// Handlers------------------------------------------------------------------
function handleSubmitFormAddTask(event) {
    event.preventDefault()
    const tasks = getTasksFromStorage()

    const formData = new FormData(addTaskFormElement)
    const fromDataEntries = Object.fromEntries(formData.entries())
    const { title, description, userId } = fromDataEntries //// user содержит  ID, а не name. То есть берется именно value, а не такст option

    const task = new Task(title, description, userId)
    tasks.push(task)

    saveTasksToStorage(tasks)
    render(tasks)

    addTaskModal.hide()
    addTaskFormElement.reset()

}

function handleSubmitFormEditTask(event) {
    event.preventDefault()
    let tasks = getTasksFromStorage()

    const formData = new FormData(editTaskFormElement)
    const fromDataEntries = Object.fromEntries(formData.entries())
    const { taskIdValue, editedTitle, editedDescription, editedUserId } = fromDataEntries

    tasks = tasks.map((task) => {
        if (task.taskId == taskIdValue) {
            return { //Создание именно новоого обьекта
                ...task, //Копирование свойств старого, и замена некоторых из них ниже
                title: editedTitle,
                description: editedDescription,
                userId: editedUserId,
            }
        }
        return task

    })

    saveTasksToStorage(tasks)
    render(tasks)

    editTaskModal.hide()
    editTaskFormElement.reset()

}

function handleCloseModalAddTask() {
    addTaskFormElement.reset()
}


//Может быть добавить тут обработчик и для редактирования

function handleClickWrapperTasks({ target }) {
    const tasks = getTasksFromStorage()
    const taskElement = target.closest('.board__task')
    if (!taskElement) return //Если будет click по любому элементу, не имеющему родителя с классом board__task, прерываю функцию

    const { dataset: { taskId } } = taskElement
    let isTasksModified = false //Флаг для отслеживания изменений

    if (target.classList.contains('dropdown-item-todo') ||
        target.classList.contains('dropdown-item-progress') ||
        target.classList.contains('dropdown-item-done')) {

        isTasksModified = onClickDropdownMove(target, tasks, taskId)

    } else if (target.classList.contains('board__task-delete')) {

        isTasksModified = onClickButtonDelete(tasks, taskId)

    } else if (target.classList.contains('board__task-edit')) {

        isTasksModified = onClickButtonEdit(tasks, taskId)
    }

    if (isTasksModified) {
        saveTasksToStorage(tasks)
        render(tasks)
    }
}

function onClickDropdownMove(target, tasks, taskId) {
    const index = tasks.findIndex((task) => task.taskId == taskId)

    if (index !== -1) {

        if (target.classList.contains('dropdown-item-todo')) {
            tasks[index].status = 'todo'
        } else if (target.classList.contains('dropdown-item-progress')) {
            const progressTasksLength = tasks.filter(task => task.status == 'in-progress').length

            if (progressTasksLength <= 5) {
                tasks[index].status = 'in-progress'
            } else {
                limitWarningModal.show()
                return false
            }

        } else {
            tasks[index].status = 'done'
        }

        tasks[index].colorClass = getColorClass(tasks[index].status)
        return true
    }

    return false
}

function onClickButtonDelete(tasks, taskId) {
    const index = tasks.findIndex(task => task.taskId == taskId)

    if (index !== -1) {
        tasks.splice(index, 1)
        return true
    }

    return false
}

function onClickButtonEdit(tasks, taskId) {
    const task = tasks.find(task => task.taskId == taskId);

    if (task) {
        document.querySelector('#editTaskTitle').value = task.title
        document.querySelector('#editTaskDescription').value = task.description
        document.querySelector('#editTaskUser').value = task.userId
        document.querySelector('#taskId').value = task.taskId //Добавляю ID, чтобы при изменениии идентифицировать какую карточку изменить в массиве

        editTaskModal.show()
    }
}

function handleClickButtonDeleteDone() {
    let tasks = getTasksFromStorage()
    tasks = tasks.filter(task => task.status !== 'done')
    saveTasksToStorage(tasks)
    render(tasks)
    deleteConfirmationModal.hide()
}
 
// Methods------------------------------------------------------------------

function render(tasks) {
    const todoBlock = document.querySelector('.board__tasks-todo')
    const progressBlock = document.querySelector('.board__tasks-progress')
    const doneBlock = document.querySelector('.board__tasks-done')
    todoBlock.innerHTML = ''
    progressBlock.innerHTML = ''
    doneBlock.innerHTML = ''

    tasks.forEach(({ title, description, userId, createdAt, colorClass, taskId, status }) => {
        const userList = getUsersFromStorage()
        const userName = userList.find((user) => user.id == userId).name //ищем в массиве тот обьект юзера, у которого ID равно значению user из обьекта задчи
        const taskHTML = buildTemplateTask({ title, description, userId: userName, createdAt, colorClass, taskId }) //заменяем значение user на userName

        if (status == 'todo') {
            todoBlock.insertAdjacentHTML('afterbegin', taskHTML)
        } else if (status == 'in-progress') {
            progressBlock.insertAdjacentHTML('afterbegin', taskHTML)
        } else if (status == 'done') {
            doneBlock.insertAdjacentHTML('afterbegin', taskHTML)
        }
    })

    updateTaskCount(tasks)
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

function updateTaskCount(tasks) {
    const todoTaskCounter = document.querySelector('.board__column-counter-todo')
    const progressTaskCounter = document.querySelector('.board__column-counter-progress')
    const doneTaskCounter = document.querySelector('.board__column-counter-done')

    todoTaskCounter.innerHTML = tasks.filter(task => task.status == 'todo').length
    progressTaskCounter.innerHTML = tasks.filter(task => task.status == 'in-progress').length
    doneTaskCounter.innerHTML = tasks.filter(task => task.status == 'done').length

}

// Templates------------------------------------------------------------------
const buildTemplateTask = ({ title, description, userId, createdAt, colorClass, taskId }) => {
    return `
    <div class="board__task ${colorClass}" data-task-id="${taskId}">
        <div class="board__task-header">
            <h3 class="board__task-title d-block">${title}</h3>
            <div class="board__task-actions">
                <div class="btn-group">
                    <button type="button" class="btn btn-warning btn-sm">Move to</button>
                    <button type="button"
                        class="btn btn-warning btn-sm dropdown-toggle dropdown-toggle-split"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item dropdown-item-todo" href="#">Todo</a></li>
                        <li><a class="dropdown-item dropdown-item-progress" href="#">In progress</a></li>
                        <li><a class="dropdown-item dropdown-item-done" href="#">Done</a></li>
                    </ul>
                </div>
                <button class="btn btn-sm board__task-edit" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path
                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                    </svg>
                </button>
                <button class="btn btn-danger btn-sm board__task-delete" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path
                            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                </button>
            </div>
        </div>
        <p class="board__task-description">${description}</p>
        <div class="board__task-footer">
            <span class="board__task-user">${userId}</span>
            <span class="board__task-time">${createdAt}</span>
        </div>
    </div>
    `
}

const buildTemplateTime = (hours, minutes, seconds) => {
    return `<p class="header__time mb-0"><span class="header__time-hours">${hours}</span>:<span class="header__time-minutes">${minutes}</span>:<span class="header__time-seconds">${seconds}</span></p>`
}

// -------------------------------код

getUsers()
render(getTasksFromStorage())
document.addEventListener('DOMContentLoaded', getCurrentTime)
setInterval(getCurrentTime, 1000)
