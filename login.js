function handleLogin() {
    const user = document.getElementById('usernameInput').value;
    if (user.trim().length < 3) {
        alert("Bitte gib einen gültigen Namen ein.");
        return;
    }
    localStorage.setItem('velocityUser', user);
    initApp();
}

function handleLogout() {
    localStorage.removeItem('velocityUser');
    location.reload();
}

function checkLogin() {
    const user = localStorage.getItem('velocityUser');
    if (user) {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('displayUser').innerText = `Willkommen, ${user}`;
        return user;
    }
    return null;
}
