function handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (username.length < 3) {
        const input = document.getElementById('usernameInput');
        input.style.borderColor = 'var(--accent)';
        setTimeout(() => input.style.borderColor = 'rgba(255,255,255,0.1)', 2000);
        return;
    }

    localStorage.setItem('velocityUser', username);
    initApp(); // Diese Funktion schaltet die Ansicht um
}

function initApp() {
    const user = localStorage.getItem('velocityUser');
    if (user) {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('displayUser').innerText = user;
        
        // App Logik aus app.js starten
        if (typeof cleanPending === "function") cleanPending();
        if (typeof render === "function") render();
    }
}

function handleLogout() {
    localStorage.removeItem('velocityUser');
    localStorage.removeItem('velocityPending');
    location.reload();
}

// Beim Laden der Seite prüfen
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('velocityUser')) {
        initApp();
    }
});
