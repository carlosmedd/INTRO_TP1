function authenticateUser(username, password) {
    fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('id', data.id);
                localStorage.setItem('nickname', data.nickname);
                localStorage.setItem('username', data.username);
                localStorage.setItem('password', data.password);
                window.location.href = 'html/home.html';
            } else {
                console.log('Usuario o contraseña invalida');
            }
        })
        .catch(error => console.error('El servidor fallo:', error));
}

document.addEventListener('DOMContentLoaded' , function() {

    console.log(localStorage);
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        authenticateUser(username, password);
    });
});