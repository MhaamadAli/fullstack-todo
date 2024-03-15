const todoForm = document.querySelector('#todo-form');
const todoList = document.querySelector('.todos');
const totalTasks = document.querySelector('#total-tasks');
const completedTasks = document.querySelector('#completed-tasks');
const remainingTasks = document.querySelector('#remaining-tasks');
const mainInput = document.querySelector('#todo-form input');
const deleteButtons = document.querySelectorAll('.remove-task');

let tasks = [];

async function loadTodosFromBackend() {
    try {
        todoList.innerHTML = ""
        const userData = JSON.parse(localStorage.getItem('authenticatedUser'));
        const user_id = userData.id;

        const response = await axios.get(`http://localhost/todo/backend/get_todos.php?user_id=${user_id}`);
        

        tasks = response.data.map(todo => ({
            id: todo.todo_id,
            description: todo.description,
            isCompleted: todo.isCompleted
        }));
        
        tasks.forEach(task => createTaskElement(task));
        
        countTasks();
    } catch (error) {
        console.error("Error loading todos:", error);
    }
}



function createTaskElement(task) {
    const taskEl = document.createElement('li');
    taskEl.setAttribute('id', task.id);

    const taskElMarkup = `
        <div>
            <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
            <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.description}</span>
        </div>
        <button title="Remove the ${task.description} task" class="remove-task" data-set="${task.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
        </button>
    `;
    taskEl.innerHTML = taskElMarkup;

    todoList.appendChild(taskEl);

}


function countTasks() {
    const completedTasksArray = tasks.filter(task => task.isCompleted);
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length;
}



async function removeTask(taskId) {
    try {
        const userData = JSON.parse(localStorage.getItem('authenticatedUser'));
        const user_id = userData.id;
        const formData = new FormData()
        formData.append("todo_id", parseInt(taskId))
        formData.append("user_id", parseInt(user_id))

        const response = await axios.post('http://localhost/todo/backend/delete_todo.php', formData);
        console.log(response);
        if (response.data.message === "deleted successfully") {
            loadTodosFromBackend()
        } else {
            console.error("Error deleting todo");
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

deleteButtons.forEach((button) => {
    button.addEventListener('click', ()=> {
        const todo_id = parseInt(button.dataset.id);
        console.log(todo_id)
        removeTask(todo_id)
    })
})


todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('authenticatedUser'))
    const user_id = userData.id

    // Get the input value
    const description = mainInput.value.trim();
    const isCompleted = parseInt(0)


    if (!description) return;

    try {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('isCompleted', isCompleted);
        formData.append('user_id', user_id);
        // Make a POST request to create a new todo
        const response = await axios.post('http://localhost/todo/backend/create_todo.php', formData);
        console.log(response)
        if (response.data.message === "todo created") {
            // Create a task object with the response data
            const task = {
                id: response.data.id,
                description: description,
                isCompleted: false
            };
            console.log(task)

            // Add the new task to the tasks array
            tasks.push(task);

            // Create the task element
            createTaskElement(task);

            // Reset the form input
            todoForm.reset();
            mainInput.focus();
        } else {
            console.error("Failed to create todo");
        }
    } catch (error) {
        console.error("Error creating todo:", error);
    }
});


todoList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('remove-task')) {
        const taskId = e.target.closest('li').id;
        removeTask(taskId);
    }
});

todoList.addEventListener('input', async (e) => {
    const taskId = e.target.closest('li').id;
    updateTask(taskId, e.target);
});

async function updateTask(taskId, el) {
    let task = tasks.find(task => task.id === parseInt(taskId));
    const userData = JSON.parse(localStorage.getItem('authenticatedUser'))
    const user_id = userData.id;
    task.user_id = parseInt(user_id);
    console.log(task);


    if (el.hasAttribute('contenteditable')) {
        task.description = el.textContent.trim();
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');
        }
    }

    try {
        // Make a POST request to update the task
        const response = await axios.post('http://localhost/todo/backend/edit_todo.php', {
            todo_id: taskId,
            description: task.description,
            isCompleted: task.isCompleted ? 1 : 0 // Corrected field name to isCompleted
        });


        if (response.data.message === "edited successfully") {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            countTasks();
        } else {
            console.error("Failed to update todo");
        }
    } catch (error) {
        
        console.error("Error updating todo:", error);
    }
}



window.addEventListener('load', loadTodosFromBackend);