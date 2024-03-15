const todoForm = document.querySelector('#todo-form')
const todoList = document.querySelector('.todos')
const totalTasks = document.querySelector('#total-tasks')
const completedTasks = document.querySelector('#completed-tasks')
const remainingTasks = document.querySelector('#remaining-tasks')
const mainInput = document.querySelector('#todo-form input')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

if (localStorage.getItem('tasks')) {
    tasks.map((task) => {
        createTask(task)
    })
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = mainInput.value

    if( inputValue == '') {
        return
    }

    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }
    
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    createTask(task)

    todoForm.reset()
    mainInput.focus()
})


todoList.addEventListener('click', (e) => {
    // it wasn't deleting unless we click on the button while if we clicked on the svg it didn't... it took me a lot of debugging time
    if ( e.target.classList.contains('remove-task') ||
    e.target.parentElement.classList.contains('remove-task')
    ) {
        const taskId = e.target.closest('li').id
        console.log('clicked')
        removeTask(taskId)
    }
})

todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id
    updateTask(taskId, e.target)
})


function createTask(task) {
    const taskEl = document.createElement('li')

    taskEl.setAttribute('id', task.id)  
    
    if (task.isCompleted) {
        taskEl.classList.add('complete')
    }

    const taskElMarkup = `
    <div>
        <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
        <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
    </div>
    <button title="Remove the ${task.name} task" class="remove-task">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>
    </button>
    `
    taskEl.innerHTML = taskElMarkup

    todoList.appendChild(taskEl)
    countTasks()
}



function countTasks() {
    const completedTasksArray = tasks.filter((task) => task.isCompleted === true)

    totalTasks.textContent = tasks.length
    completedTasks.textContent = completedTasksArray.length
    remainingTasks.textContent = tasks.length - completedTasksArray.length
}

function removeTask(taskId) {
    tasks = tasks.filter((task)=> task.id !== parseInt(taskId))
    console.log(tasks)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById(taskId).remove()
    countTasks()
}


function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId))

    if(el.hasAttribute('contenteditable')) {
        task.name  = el.textContent
    } else {
        const span = el.nextElementSibling
        const parent = el.closest('li')

        task.isCompleted = !task.isCompleted

        if(task.isCompleted) {
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        } else {
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('complete')
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
    countTasks()
}