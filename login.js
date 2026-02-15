document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username-input');
    
    // Check if logged in
    const storedUser = localStorage.getItem('velocity_user');
    if (storedUser) {
        showDashboard(storedUser);
    }

    // Login Action
    loginBtn.addEventListener('click', () => {
        const user = usernameInput.value.trim();
        if (user) {
            localStorage.setItem('velocity_user', user);
            showDashboard(user);
        } else {
            alert("Bitte gib einen Usernamen ein.");
        }
    });

    // Logout Action
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('velocity_user');
            location.reload(); // Seite neu laden
        });
    }
});

function showDashboard(username) {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('display-username').innerText = username;
    
    // Starte die App-Logik (aus app.js)
    if (typeof initApp === 'function') {
        initApp();
    }
}
