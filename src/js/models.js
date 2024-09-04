import {
    generateUniqueId,
    getCurrentDate,
    getColorClass
} from './methods.js'


class Task {
    constructor(title, description, user) {
        this.taskId = generateUniqueId()
        this.title = title
        this.description = description
        this.userId = user
        this.status = 'todo'
        this.createdAt = getCurrentDate()
        this.colorClass = getColorClass(this.status)
        this.movedAt = new Date() // for sorting tasks by move time
    }
}

export {
    Task
}