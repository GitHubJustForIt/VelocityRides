let currentFilter = 'all';

function render() {
    const user = localStorage.getItem('velocityUser');
    const pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    const filtered = projects.filter(p => {
        if (currentFilter === 'pending') return pendingList.includes(p.id);
        if (currentFilter === 'purchased') return p.purchased && p.buyer === user;
        return true;
    });

    filtered.forEach(p => {
        const isPending = pendingList.includes(p.id);
        const isOwned = p.purchased && p.buyer === user;
        const isSold = p.purchased && p.buyer !== user;

        let badge = '';
        if (isOwned) badge = '<span class="badge badge-owned">OWNED</span>';
        else if (isSold) badge = '<span class="badge badge-sold">SOLD</span>';
        else if (isPending) badge = '<span class="badge badge-pending">PENDING</span>';

        const card = document.createElement('div');
        card.className = 'glass-card card fade-in';
        card.onclick = () => openModal(p.id);
        card.innerHTML = `
            ${badge}
            <img src="${p.image}" alt="${p.title}">
            <div class="card-content">
                <h3>${p.title}</h3>
                <span class="price-tag">${p.price}</span>
                <p style="font-size: 0.8rem; color: var(--text-dim);">${p.description.substring(0, 50)}...</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openModal(id) {
    const p = projects.find(x => x.id === id);
    const pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    
    const modal = document.getElementById('modal');
    const details = document.getElementById('modalDetails');
    const actionArea = document.querySelector('.modal-action-area');

    details.innerHTML = `
        <h2 style="color: var(--primary);">${p.title}</h2>
        <p style="color: var(--text-dim); line-height: 1.6;">${p.description}</p>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Gamepass:</strong> ${p.gamepass}</p>
            <p><strong>Status:</strong> ${p.purchased ? 'Verkauft' : 'Verfügbar'}</p>
        </div>
    `;

    if (p.purchased || pendingList.includes(id)) {
        actionArea.style.display = 'none';
    } else {
        actionArea.style.display = 'block';
        document.getElementById('confirmBtn').onclick = () => addPending(p);
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Filter Navigation
function updateFilter(filter, btnId) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
    render();
}

// Hilfsfunktionen für Filter (aus index.html aufgerufen)
function showAll() { updateFilter('all', 'btn-all'); }
function showPending() { updateFilter('pending', 'btn-pending'); }
function showPurchased() { updateFilter('purchased', 'btn-purchased'); }
