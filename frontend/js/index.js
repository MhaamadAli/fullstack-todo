const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    if (username) {
        formData.append('username', username);
    } else if (email) {
        formData.append('email', email);
    }
    formData.append('password', password);

    try {
        const response = await axios.post('http://localhost/todo/backend/login.php', formData)
        if(response.data.message === "logged in") {
            localStorage.setItem('authenticatedUser', JSON.stringify(response.data))
            window.location.href = './pages/todo.html';
        }
    } catch (error) {
        console.log(error)
    }
});


const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    if (username) {
        formData.append('username', username);
    } else if (email) {
        formData.append('email', email);
    }
    formData.append('password', password);

    try {
        const response = await axios.post('http://localhost/todo/backend/login.php', formData)
        if(response.data.message === "logged in") {
            localStorage.setItem('authenticatedUser', JSON.stringify(response.data))
            window.location.href = './pages/todo.html';
        }
    } catch (error) {
        console.log(error)
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const signupLink = document.querySelector('a[href="#signup"]');
    const loginLink = document.querySelector('a[href="#login"]');

    signupLink.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

});