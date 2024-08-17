import { generateUniqueId, getCurrentDate } from './methods.js'


function Task(title, description, user) {
    this.id = generateUniqueId()
    this.title = title
    this.description = description
    this.user = user
    this.status = 'todo'
    this.createdAt = getCurrentDate()
    this.colorClass = 'board__task_blue'
}

export {
    Task
}