document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('v_user');
    if (user) {
        showApp(user);
    }

    document.getElementById('login-btn').addEventListener('click', () => {
        const input = document.getElementById('username-input').value.trim();
        if (input) {
            localStorage.setItem('v_user', input);
            showApp(input);
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('v_user');
        location.reload();
    });
});

function showApp(user) {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('display-username').innerText = user;
    if (window.initApp) window.initApp();
}
