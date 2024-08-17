import { generateUniqueId, getCurrentDate, getColorClass } from './methods.js'


function Task(title, description, user) {
    this.id = generateUniqueId()
    this.title = title
    this.description = description
    this.user = user
    this.status = 'todo'
    this.createdAt = getCurrentDate()
    this.colorClass = getColorClass(this.status)
}

export {
    Task
}