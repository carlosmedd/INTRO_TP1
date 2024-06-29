document.addEventListener('DOMContentLoaded' , function() {
    console.log(localStorage);

    const nickname = localStorage.getItem('nickname');
    if (nickname) {
        document.getElementById('welcomeMessage').textContent = `Bienvenido ${nickname}`;
    } else {
        window.location.href = '/index.html';   
    }

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('id');
        localStorage.removeItem('nickname');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.href = '/index.html';
    });
});
