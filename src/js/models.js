import {
    generateUniqueId,
    getCurrentDate,
    getColorClass
} from './methods.js'


class Task {

    taskId = generateUniqueId()
    status = 'todo'
    createdAt = getCurrentDate()
    colorClass = getColorClass(this.status)
    movedAt = new Date() // for sorting tasks by move time

    constructor(title, description, user) {
        this.title = title
        this.description = description
        this.userId = user
    }
}

export {
    Task
}