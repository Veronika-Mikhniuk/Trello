import { Modal } from 'bootstrap'

//Modals
const addTaskModalElement = document.querySelector('#addTaskModal')
const editTaskModalElement = document.querySelector('#editTaskModal')
const deleteTasksModalElement = document.querySelector('#deleteConfirmationModal')
const taskLimitModalElement = document.querySelector('#taskLimitModal')

const addTaskModal = new Modal(addTaskModalElement) //Initializing a modal to have access to its methods
const editTaskModal = new Modal(editTaskModalElement)
const deleteConfirmationModal = new Modal(deleteTasksModalElement)
const limitWarningModal = new Modal(taskLimitModalElement)

//Other variables
const addTaskFormElement = document.querySelector('#addTaskForm')
const editTaskFormElement = document.querySelector('#editTaskForm')
const tasksBlock = document.querySelector('.board')
const deleteConfirmationButtonElement = document.querySelector('#deleteTasksConfirm')

export {
    addTaskModalElement,
    editTaskModalElement,
    deleteTasksModalElement,
    taskLimitModalElement,
    addTaskModal,
    editTaskModal,
    deleteConfirmationModal,
    limitWarningModal,
    addTaskFormElement,
    editTaskFormElement,
    tasksBlock,
    deleteConfirmationButtonElement
}