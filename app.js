// State
let projects = []; // Lädt initialProjects
let currentUser = "";
let pendingList = []; // Array von IDs

// DOM Elements
const grid = document.getElementById('projects-grid');
const modal = document.getElementById('product-modal');
const closeModalBtn = document.querySelector('.close-modal');
const confirmBtn = document.getElementById('confirm-pending-btn');

// 1. Initialisierung
function initApp() {
    currentUser = localStorage.getItem('velocity_user');
    
    // Pending Liste aus LocalStorage laden
    const storedPending = localStorage.getItem('velocity_pending');
    pendingList = storedPending ? JSON.parse(storedPending) : [];

    // Projekte laden (Simuliert Datenbank)
    projects = [...initialProjects];

    // Clean Pending: Falls ein Produkt global "Sold" ist (purchased = true),
    // aber wir es in "Pending" haben, muss es aus Pending raus.
    cleanPending();

    render(projects);
}

// 2. Rendering
function render(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p style='text-align:center; width:100%; color:#777;'>Keine Produkte gefunden.</p>";
        return;
    }

    list.forEach(proj => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Status ermitteln
        let badgeHTML = "";
        let statusClass = "";
        
        // Logik Hierarchie:
        // 1. Ist es global verkauft an MICH? -> OWNED
        // 2. Ist es global verkauft an ANDERE? -> SOLD
        // 3. Habe ich es in meiner Pending Liste? -> PENDING
        
        const isOwnedByMe = proj.purchased && proj.buyer === currentUser;
        const isSoldToOther = proj.purchased && proj.buyer !== currentUser;
        const isPending = pendingList.includes(proj.id);

        if (isOwnedByMe) {
            badgeHTML = `<div class="card-badge badge-owned">OWNED</div>`;
            statusClass = "owned";
        } else if (isSoldToOther) {
            badgeHTML = `<div class="card-badge badge-sold">SOLD</div>`;
            statusClass = "sold";
        } else if (isPending) {
            badgeHTML = `<div class="card-badge badge-pending">PENDING</div>`;
            statusClass = "pending";
        }

        card.innerHTML = `
            <div class="card-img" style="background-image: url('${proj.image}');"></div>
            ${badgeHTML}
            <div class="card-body">
                <span class="card-price">${proj.price}</span>
                <h3 class="card-title">${proj.title}</h3>
                <p style="color:#aaa; font-size:0.9rem;">${proj.description}</p>
            </div>
        `;

        // Klick Event für Modal
        card.addEventListener('click', () => openModal(proj, statusClass));
        grid.appendChild(card);
    });
}

// 3. Modal Logic
function openModal(proj, status) {
    // Populate Data
    document.getElementById('modal-img').src = proj.image;
    document.getElementById('modal-title').innerText = proj.title;
    document.getElementById('modal-desc').innerText = proj.description;
    document.getElementById('modal-price').innerText = proj.price;
    document.getElementById('modal-gamepass').innerText = proj.gamepass;

    // Tags rendering
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = proj.tags.map(t => `<span>#${t}</span>`).join('');

    // Action Logic basierend auf Status
    const actionArea = document.getElementById('modal-action-area');
    const statusMsg = document.getElementById('modal-status-msg');
    const contactInput = document.getElementById('contact-input');

    actionArea.classList.remove('hidden');
    statusMsg.classList.add('hidden');
    statusMsg.innerHTML = "";
    confirmBtn.onclick = null; // Reset Listener

    if (status === 'sold') {
        actionArea.classList.add('hidden');
        statusMsg.classList.remove('hidden');
        statusMsg.innerHTML = `<p style="color:var(--danger); text-align:center;">Dieses Produkt ist bereits verkauft.</p>`;
    } else if (status === 'owned') {
        actionArea.classList.add('hidden');
        statusMsg.classList.remove('hidden');
        statusMsg.innerHTML = `<p style="color:var(--success); text-align:center;">Du besitzt dieses Produkt bereits. Checke deine Downloads.</p>`;
    } else if (status === 'pending') {
        actionArea.classList.add('hidden');
        statusMsg.classList.remove('hidden');
        statusMsg.innerHTML = `<p style="color:var(--warning); text-align:center;">Anfrage läuft. Warte auf Kontakt vom Team.</p>`;
    } else {
        // Available - Logic for Confirm
        confirmBtn.onclick = () => {
            const contact = contactInput.value.trim();
            if(!contact) {
                alert("Bitte Kontaktmöglichkeit angeben!");
                return;
            }
            addPending(proj, contact);
        };
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target == modal) closeModal();
});

// 4. Pending & Webhook
function addPending(proj, contact) {
    // 1. Add to Array
    pendingList.push(proj.id);
    
    // 2. Save to LocalStorage
    localStorage.setItem('velocity_pending', JSON.stringify(pendingList));
    
    // 3. Send Webhook
    sendWebhook(proj, currentUser, contact);

    // 4. UI Feedback
    alert("Anfrage gesendet! Status auf PENDING gesetzt.");
    closeModal();
    render(projects); // Re-render to show Badge
}

function cleanPending() {
    // Entfernt Pending Items, die in der Zwischenzeit verkauft wurden
    const newPending = pendingList.filter(id => {
        const p = projects.find(x => x.id === id);
        // Behalten, wenn Projekt existiert UND nicht verkauft ist
        return p && !p.purchased; 
    });
    
    if (newPending.length !== pendingList.length) {
        pendingList = newPending;
        localStorage.setItem('velocity_pending', JSON.stringify(pendingList));
    }
}

function sendWebhook(product, user, contact) {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes("HIER_DEINE")) {
        console.warn("Webhook URL nicht konfiguriert.");
        return;
    }

    const payload = {
        username: "Velocity Rides Bot",
        embeds: [{
            title: "🛒 New Purchase Request",
            color: 16776960, // Yellow
            fields: [
                { name: "Product", value: product.title, inline: true },
                { name: "Price", value: product.price, inline: true },
                { name: "Buyer (User)", value: user, inline: false },
                { name: "Contact Method", value: contact, inline: false },
                { name: "Status", value: "PENDING", inline: true }
            ],
            footer: { text: "Velocity Rides Dashboard" },
            timestamp: new Date().toISOString()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(err => console.error("Webhook Error:", err));
}

// 5. Filter Logic
function filterProjects(type) {
    // Buttons Active State
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (type === 'all') {
        render(projects);
    } else if (type === 'pending') {
        // Zeige nur items aus meiner pendingList
        const pendingProjs = projects.filter(p => pendingList.includes(p.id));
        render(pendingProjs);
    } else if (type === 'purchased') {
        // Zeige nur Items, die owned sind
        const ownedProjs = projects.filter(p => p.purchased && p.buyer === currentUser);
        render(ownedProjs);
    }
}
