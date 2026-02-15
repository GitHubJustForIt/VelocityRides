let projects = [];
let pendingList = [];
let currentUser = "";

window.initApp = function() {
    currentUser = localStorage.getItem('v_user');
    const stored = localStorage.getItem('v_pending');
    pendingList = stored ? JSON.parse(stored) : [];
    projects = [...initialProjects];
    
    render(projects);
};

function render(list) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = "";

    list.forEach(p => {
        const isOwned = p.purchased && p.buyer === currentUser;
        const isSold = p.purchased && p.buyer !== currentUser;
        const isPending = pendingList.includes(p.id);

        let badge = "";
        if (isOwned) badge = '<span class="badge" style="background:var(--success)">OWNED</span>';
        else if (isSold) badge = '<span class="badge" style="background:var(--sold)">SOLD</span>';
        else if (isPending) badge = '<span class="badge" style="background:var(--pending)">PENDING</span>';

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${p.image}')"></div>
            <div class="card-content">
                <span class="price-tag">${p.price}</span>
                <h3>${p.title}</h3>
                ${badge}
            </div>
        `;
        card.onclick = () => openModal(p);
        grid.appendChild(card);
    });
}

function openModal(p) {
    const isOwned = p.purchased && p.buyer === currentUser;
    const isSold = p.purchased && p.buyer !== currentUser;
    const isPending = pendingList.includes(p.id);

    document.getElementById('modal-img-bg').style.backgroundImage = `url('${p.image}')`;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-desc').innerText = p.description;
    document.getElementById('modal-price').innerText = p.price;
    document.getElementById('modal-gamepass').innerText = p.gamepass;
    
    const area = document.getElementById('modal-action-area');
    const msg = document.getElementById('modal-status-msg');
    
    area.classList.add('hidden');
    msg.classList.add('hidden');

    if (isOwned || isSold || isPending) {
        msg.classList.remove('hidden');
        msg.innerHTML = isOwned ? "Besitzt" : isSold ? "Verkauft" : "In Bearbeitung (Pending)";
    } else {
        area.classList.remove('hidden');
        document.getElementById('confirm-pending-btn').onclick = () => {
            const contact = document.getElementById('contact-input').value;
            if (contact) {
                pendingList.push(p.id);
                localStorage.setItem('v_pending', JSON.stringify(pendingList));
                sendWebhook(p, contact);
                document.getElementById('product-modal').classList.add('hidden');
                render(projects);
            }
        };
    }
    document.getElementById('product-modal').classList.remove('hidden');
}

function sendWebhook(p, contact) {
    if (WEBHOOK_URL === "DEINE_DISCORD_WEBHOOK_URL") return;
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            embeds: [{
                title: "Neue Pending Anfrage",
                fields: [
                    { name: "Produkt", value: p.title },
                    { name: "User", value: currentUser },
                    { name: "Kontakt", value: contact }
                ],
                color: 5814783
            }]
        })
    });
}

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('product-modal').classList.add('hidden');
};

function filterProjects(type) {
    if (type === 'all') render(projects);
    if (type === 'pending') render(projects.filter(p => pendingList.includes(p.id)));
    if (type === 'purchased') render(projects.filter(p => p.purchased && p.buyer === currentUser));
}
