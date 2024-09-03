import {
    addTaskModal,
    editTaskModal,
    deleteConfirmationModal,
    limitWarningModal,
    addTaskFormElement,
    editTaskFormElement
} from './declarations.js'
import { Task } from './models.js'
import {
    getColorClass,
    saveTasksToStorage,
    getTasksFromStorage,
    render
} from './methods.js'

function handleSubmitFormAddTask(event) {
    event.preventDefault()
    const tasks = getTasksFromStorage()

    const formData = new FormData(addTaskFormElement)
    const fromDataEntries = Object.fromEntries(formData.entries())
    const { title, description, userId } = fromDataEntries //// userId, because: When saving data, FormData takes the value of option, not the option text

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
            return { //Creating exactly a new object
                ...task, //Copying the properties of the old one, and replacing some of them below
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

function handleClickWrapperTasks({ target }) {
    const tasks = getTasksFromStorage()
    const taskElement = target.closest('.board__task')
    if (!taskElement) return //If it will be a click on any element doesn't have a parent with the board__task class, interrupt the function

    const { dataset: { taskId } } = taskElement
    let isTasksModified = false //Flag for monitoring changes

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

function handleClickButtonDeleteDone() {
    let tasks = getTasksFromStorage()
    tasks = tasks.filter(task => task.status !== 'done')
    saveTasksToStorage(tasks)
    render(tasks)
    deleteConfirmationModal.hide()
}

// OnClick functions for handleClickWrapperTasks
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
        tasks[index].movedAt = new Date() // for sorting tasks by move time
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
    const task = tasks.find(task => task.taskId == taskId)

    if (task) {
        document.querySelector('#editTaskTitle').value = task.title
        document.querySelector('#editTaskDescription').value = task.description
        document.querySelector('#editTaskUser').value = task.userId
        document.querySelector('#taskId').value = task.taskId //Added ID to identify which card to change in the array when changing it

        editTaskModal.show()
    }
}

export {
    handleSubmitFormAddTask,
    handleSubmitFormEditTask,
    handleCloseModalAddTask,
    handleClickWrapperTasks,
    handleClickButtonDeleteDone
}