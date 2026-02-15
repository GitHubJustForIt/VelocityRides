let currentFilter = 'all';

// 1. RENDER FUNKTION
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

        let statusHtml = '';
        if (isOwned) statusHtml = `<span class="status-pill s-owned">Owned by you</span>`;
        else if (isSold) statusHtml = `<span class="status-pill s-sold">Sold to ${p.buyer}</span>`;
        else if (isPending) statusHtml = `<span class="status-pill s-pending">Reserved (Pending)</span>`;

        const card = document.createElement('div');
        card.className = 'card fade-in';
        card.onclick = () => openModal(p.id);
        card.innerHTML = `
            <img src="${p.image}" class="card-img">
            <div class="card-info">
                ${statusHtml}
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                    <span style="font-weight:800; color:var(--accent)">${p.price}</span>
                    <i class="fas fa-arrow-right" style="opacity:0.3"></i>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 2. MODAL LOGIK
function openModal(id) {
    const p = projects.find(x => x.id === id);
    const pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    
    // UI-Step auf "Pending" setzen
    updateVisualSteps(2);

    const modal = document.getElementById('modal');
    document.getElementById('modalDetails').innerHTML = `
        <div class="modal-header-img" style="background-image: url('${p.image}')"></div>
        <div style="padding:30px">
            <h2 style="margin:0">${p.title}</h2>
            <p style="color:var(--subtext); margin: 15px 0;">${p.description}</p>
            <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:15px; font-size:0.9rem;">
                <p><strong>Required:</strong> ${p.gamepass}</p>
                <p><strong>Tags:</strong> ${p.tags.join(', ')}</p>
            </div>
        </div>
    `;

    const btn = document.getElementById('confirmBtn');
    if (p.purchased || pendingList.includes(id)) {
        btn.style.display = 'none';
        document.getElementById('contactInput').style.display = 'none';
    } else {
        btn.style.display = 'block';
        document.getElementById('contactInput').style.display = 'block';
        btn.onclick = () => addPending(p);
    }
    modal.style.display = 'flex';
}

// 3. RESERVIERUNG & WEBHOOK
async function addPending(product) {
    const contact = document.getElementById('contactInput').value;
    const user = localStorage.getItem('velocityUser');

    if (contact.length < 3) {
        alert("Please enter a valid Discord/Contact tag.");
        return;
    }

    // LocalStorage Update
    let pendingList = JSON.parse(localStorage.getItem('velocityPending') || "[]");
    pendingList.push(product.id);
    localStorage.setItem('velocityPending', JSON.stringify(pendingList));

    // UI Steps updaten
    updateVisualSteps(3);

    // Discord Webhook
    await sendDiscordNotification(product, user, contact);

    alert("Reservation successful! The team will contact you.");
    closeModal();
    render();
}

async function sendDiscordNotification(p, user, contact) {
    if (WEBHOOK_URL.includes("HIER")) return;

    const data = {
        embeds: [{
            title: "🛒 NEW RESERVATION",
            color: 5814783,
            fields: [
                { name: "Product", value: p.title, inline: true },
                { name: "Price", value: p.price, inline: true },
                { name: "Customer", value: user, inline: true },
                { name: "Contact", value: contact, inline: true }
            ],
            footer: { text: "Velocity Rides Dashboard" }
        }]
    };

    await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// 4. HILFSFUNKTIONEN
function updateVisualSteps(stepNumber) {
    document.querySelectorAll('.p-step').forEach((s, idx) => {
        if (idx < stepNumber) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    updateVisualSteps(1); // Zurück zum Suchen
}
