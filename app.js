let currentFilter = 'all';
let selectedProductId = null;

// Initialisierung
window.onload = () => {
    if (checkLogin()) {
        cleanPending();
        render();
    }
};

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
        card.className = 'card';
        card.onclick = () => openModal(p.id);
        card.innerHTML = `
            ${badge}
            <img src="${p.image}" alt="${p.title}">
            <div class="card-body">
                <h3>${p.title}</h3>
                <p>${p.price}</p>
                <div class="tags">${p.tags.map(t => `<small>#${t} </small>`).join('')}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openModal(id) {
    const p = projects.find(x => x.id === id);
    const user = localStorage.getItem('velocityUser');
    const pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    
    selectedProductId = id;
    const modal = document.getElementById('modal');
    const details = document.getElementById('modalDetails');
    const confirmBtn = document.getElementById('confirmBtn');

    details.innerHTML = `
        <img src="${p.image}" style="width:100%; border-radius:8px;">
        <h2>${p.title}</h2>
        <p>${p.description}</p>
        <p><strong>Preis:</strong> ${p.price}</p>
        <p><strong>Gamepass:</strong> ${p.gamepass}</p>
    `;

    // Button Logik
    if (p.purchased || pendingList.includes(id)) {
        confirmBtn.style.display = 'none';
        document.getElementById('contactInput').style.display = 'none';
    } else {
        confirmBtn.style.display = 'block';
        document.getElementById('contactInput').style.display = 'block';
        confirmBtn.onclick = () => addPending(p);
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function addPending(product) {
    const contact = document.getElementById('contactInput').value;
    const user = localStorage.getItem('velocityUser');

    if (!contact) {
        alert("Bitte gib eine Kontaktmöglichkeit an!");
        return;
    }

    let pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    pendingList.push(product.id);
    localStorage.setItem('velocityPending', JSON.stringify(pendingList));

    sendWebhook(product, user, contact);
    closeModal();
    render();
}

async function sendWebhook(product, user, contact) {
    if (!WEBHOOK_URL || WEBHOOK_URL === "DEINE_DISCORD_WEBHOOK_URL_HIER") return;

    const payload = {
        embeds: [{
            title: "🆕 Neue Pending-Anfrage",
            color: 15844367,
            fields: [
                { name: "Produkt", value: product.title, inline: true },
                { name: "User", value: user, inline: true },
                { name: "Kontakt", value: contact }
            ],
            timestamp: new Date()
        }]
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { console.error("Webhook Error", e); }
}

function cleanPending() {
    let pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    // Entferne IDs, die in der Datenbank als verkauft markiert sind
    pendingList = pendingList.filter(id => {
        const p = projects.find(x => x.id === id);
        return p && !p.purchased;
    });
    localStorage.setItem('velocityPending', JSON.stringify(pendingList));
}

// Filter Navigation
function showAll() { updateFilter('all', 'btn-all'); }
function showPending() { updateFilter('pending', 'btn-pending'); }
function showPurchased() { updateFilter('purchased', 'btn-purchased'); }

function updateFilter(filter, btnId) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
    render();
}
