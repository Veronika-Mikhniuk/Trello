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

export {
    buildTemplateTask,
    buildTemplateTime
}