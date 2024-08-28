import { generateUniqueId, getCurrentDate, getColorClass } from './methods.js'


function Task(title, description, user) {
    this.taskId = generateUniqueId()
    this.title = title
    this.description = description
    this.userId = user
    this.status = 'todo'
    this.createdAt = getCurrentDate()
    this.colorClass = getColorClass(this.status)
}

export {
    Task
}