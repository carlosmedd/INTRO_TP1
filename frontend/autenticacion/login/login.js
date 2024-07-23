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
                window.location.href = 'http://127.0.0.1:8000/mi_rutina';
            } else {
                const alert = document.getElementById('alert');
                alert.style.display = 'block';
            }
        })
        .catch(error => console.error('El servidor fallo:', error));
}

document.addEventListener('DOMContentLoaded' , function() {
    console.log(localStorage);

    const alert = document.getElementById('alert');
    alert.style.display = 'none';

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        authenticateUser(username, password);
    });

    // ---------------------------------------------------------------------------

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');

    function checkInputs() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);

    // ----------------------------------------------------------

    document.getElementById('togglePassword').addEventListener('click', function () {
        
        const passwordField = document.getElementById('password');
        const passwordFieldType = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', passwordFieldType);
        
        this.querySelector('i').classList.toggle('bi-eye');
        this.querySelector('i').classList.toggle('bi-eye-slash');
    });
    
});