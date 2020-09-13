'use strict';

class Task {
    constructor(title) {
        this.id = this.generateId();
        this.title = title;
        this.isCompleted = false;
    }

    generateId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

}

class TaskList {
    constructor(tasks) {
        this._tasks = tasks || [];
    }

    get tasks() {
        return this._tasks;
    }

    add(task) {
        this.tasks.push(task);
        return this;
    }

    findIndexByTaskId(taskId) {
        return this._tasks.findIndex(x => x.id === taskId);
    }

    edit(taskId, title) {
        const editedTaskIndex = this.findIndexByTaskId(taskId);
        this._tasks[editedTaskIndex].title = title;
        return this;
    }

    delete(taskId) {
        this._tasks = this._tasks.filter(x => x.id !== taskId);
        return this;
    }

    completed(taskId) {
        const completedTaskIndex = this.findIndexByTaskId(taskId);
        this._tasks[completedTaskIndex].isCompleted = false;
        return this;
    }

    unCompleted(taskId) {
        const completedTaskIndex = this.findIndexByTaskId(taskId);
        this._tasks[completedTaskIndex].isCompleted = true;
        return this;
    }

    loadFromStorage() {
        this._tasks = JSON.parse(window.localStorage.getItem('taskList'));
        return this;
    }

    saveToStorage() {
        window.localStorage.setItem('taskList', JSON.stringify(this._tasks));
        return this;
    }
}

class OutputRender {
    constructor(tasks) {
        this._tasks = tasks || [];
    }

    set tasks(tasksArray) {
        this._tasks = tasksArray;
    }

    toHTML() {
        let htmlTasks = '';
        this._tasks.sort((a, b) => (a.title > b.title) ? 1 : -1);
        this._tasks.forEach((item) => {
            htmlTasks += `
              <li id="${item.id}" ${item.isCompleted ? 'class="task-completed"' : ''}>
                  <input class="checkbox-task-completed" type="checkbox" ${item.isCompleted ? 'checked' : ''}/>
                <div class="task-title" contenteditable="true" aria-multiline="true">${item.title}</div>
                <div role="img" class="remove-button" title="remove"></div>
              </li>`;
        });
        return htmlTasks;
    }

    addTasksEvents() {
        const removeButtons = document.querySelectorAll('.remove-button');
        for (const removeButton of removeButtons) {
            removeButton.addEventListener('click', event => {
                if (confirm("Are you sure remove the task?") === true) {
                    event.preventDefault();
                    const liParent = event.target.parentNode;
                    taskList.delete(liParent.id).saveToStorage();
                    liParent.remove();
                }
            });
        }

        const editTaskDivs = document.querySelectorAll('.task-title');
        for (const editTaskDiv of editTaskDivs) {
            editTaskDiv.addEventListener('keyup', event => {
                const liParent = event.target.parentNode;
                taskList.edit(liParent.id, editTaskDiv.textContent).saveToStorage();
            });
        }

        const checkboxTasksCompleted = document.querySelectorAll('.checkbox-task-completed');
        for (const checkboxTaskCompleted of checkboxTasksCompleted) {
            checkboxTaskCompleted.addEventListener('click', event => {
                const liParent = event.target.parentNode;
                if (event.target.checked === true) {
                    liParent.classList.add('task-completed');
                    taskList.unCompleted(liParent.id).saveToStorage();
                } else {
                    liParent.classList.remove('task-completed');
                    taskList.completed(liParent.id).saveToStorage();
                }
            });
        }
        return this;
    }
}


const tasksField = document.getElementById('tasksList');
const addTaskField = document.getElementById('taskTitle');
const addTaskButton = document.getElementById('addTaskBtn');

const taskList = new TaskList();
const render = new OutputRender();

// load tasks from localStorage
if (window.localStorage.getItem('taskList')) {
    render.tasks = taskList.loadFromStorage().tasks;
    tasksField.innerHTML = render.toHTML();
    render.addTasksEvents();
}

const newTaskAction = () => {
    if (addTaskField.value) {
        // mb escapeHTML if needed  for addTaskField.value
        taskList.add(new Task(addTaskField.value)).saveToStorage();
        render.tasks = taskList.tasks;
        tasksField.innerHTML = render.toHTML();
        render.addTasksEvents();
        addTaskField.value = '';
    }
}


// event listeners
addTaskButton.addEventListener('click', event => {
    event.preventDefault();
    newTaskAction();
});
addTaskField.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        newTaskAction();
    }
});


