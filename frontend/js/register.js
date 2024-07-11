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
                window.location.href = 'http://127.0.0.1:8000/mi_rutina';

            } else {
                const alert = document.getElementById('alert');
                alert.innerHTML = 'El nombre de usuario ya esta en uso.';
                alert.style.display = 'block';
            }
        })
        .catch(error => console.error('El servidor fallo:', error));
}

document.addEventListener('DOMContentLoaded' , function() {
    console.log(localStorage);

    const alert = document.getElementById('alert');
    alert.style.display = 'none';

    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const nickname = document.getElementById('nickname').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;

        if (password != confirm_password) {
            alert.innerHTML = 'Las contraseñas no coinciden.'
            alert.style.display = 'block';
        } else {
            registerUser(username, nickname, password);
        }

       
    });

    // ---------------------------------------------------------------------------

    const usernameInput = document.getElementById('username');
    const nicknameInput = document.getElementById('nickname');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');

    const submitBtn = document.getElementById('submit-btn');

    function checkInputs() {
        const username = usernameInput.value;
        const nickname = nicknameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if ((username && nickname) && (password && confirmPassword)) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    usernameInput.addEventListener('input', checkInputs);
    nicknameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
    confirmPasswordInput.addEventListener('input', checkInputs);
});