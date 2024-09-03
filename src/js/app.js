import {
    addTaskModalElement,
    addTaskFormElement,
    editTaskFormElement,
    tasksBlock,
    deleteConfirmationButtonElement
} from './declarations.js'
import {
    getTasksFromStorage,
    render,
    getCurrentTime
} from './methods.js'
import { getUsers } from './requests.js'
import {
    handleSubmitFormAddTask,
    handleSubmitFormEditTask,
    handleCloseModalAddTask,
    handleClickWrapperTasks,
    handleClickButtonDeleteDone
} from './handlers.js'


// Add event listeners
addTaskFormElement.addEventListener('submit', handleSubmitFormAddTask)
editTaskFormElement.addEventListener('submit', handleSubmitFormEditTask)
addTaskModalElement.addEventListener('hidden.bs.modal', handleCloseModalAddTask)
tasksBlock.addEventListener('click', handleClickWrapperTasks)
deleteConfirmationButtonElement.addEventListener('click', handleClickButtonDeleteDone)


// Initializing
getUsers()
render(getTasksFromStorage())
document.addEventListener('DOMContentLoaded', getCurrentTime)
setInterval(getCurrentTime, 1000)
