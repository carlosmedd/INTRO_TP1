function registerUser(username, nickname, password) {
    fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, nickname, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('id', data.id);
                localStorage.setItem('nickname', data.nickname);
                localStorage.setItem('username', data.username);
                localStorage.setItem('password', data.password);
                
                console.log(localStorage);
                alert("Usuario creado existosamente");
                window.location.href = 'http://127.0.0.1:8000/html/home.html';
            } else {
                alert("El usuario ya existe.");
            }
        })
        .catch(error => console.error('El servidor fallo:', error));
}

document.addEventListener('DOMContentLoaded' , function() {
    console.log(localStorage);

    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const nickname = document.getElementById('nickname').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;

        if (username == '') {
            alert('Debes tener un nombre de usuario.');

        } else if (nickname == '') {
            alert('Debes tener un apodo o nombre.');

        } else if (password == '') {
            alert('Debes tener una contraseña.');

        } else if (password != confirm_password) {
            alert('Las contraseñas no son iguales.');

        } else {
            registerUser(username, nickname, password);
        }

       
    });
});