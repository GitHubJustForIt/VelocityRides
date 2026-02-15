// Daten und Status
let projects = [];
let currentUser = "";
let pendingList = [];

const grid = document.getElementById('projects-grid');
const modal = document.getElementById('product-modal');
const closeModalBtn = document.querySelector('.close-modal');
const confirmBtn = document.getElementById('confirm-pending-btn');

// --- INIT ---
function initApp() {
    currentUser = localStorage.getItem('velocity_user');
    const storedPending = localStorage.getItem('velocity_pending');
    pendingList = storedPending ? JSON.parse(storedPending) : [];

    // Lade Projekte aus data.js
    projects = [...initialProjects];
    cleanPending(); // Bereinigen
    
    // Initial Render All
    render(projects);
}

// --- RENDER ENGINE ---
function render(list) {
    grid.innerHTML = "";
    
    // Animation reset für Grid
    grid.style.animation = 'none';
    grid.offsetHeight; /* trigger reflow */
    grid.style.animation = 'fadeInUp 0.8s ease-out';

    if (list.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:#555;'>No templates found.</p>";
        return;
    }

    list.forEach(proj => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        let badgeHTML = "";
        let statusClass = "available";

        const isOwnedByMe = proj.purchased && proj.buyer === currentUser;
        const isSoldToOther = proj.purchased && proj.buyer !== currentUser;
        const isPending = pendingList.includes(proj.id);

        if (isOwnedByMe) {
            badgeHTML = `<div class="card-badge badge-owned"><i class="fas fa-check"></i> OWNED</div>`;
            statusClass = "owned";
        } else if (isSoldToOther) {
            badgeHTML = `<div class="card-badge badge-sold">SOLD</div>`;
            statusClass = "sold";
        } else if (isPending) {
            badgeHTML = `<div class="card-badge badge-pending"><i class="fas fa-clock"></i> PENDING</div>`;
            statusClass = "pending";
        }

        card.innerHTML = `
            <div class="card-img" style="background-image: url('${proj.image}');">
                ${badgeHTML}
            </div>
            <div class="card-body">
                <h3 class="card-title">${proj.title}</h3>
                <span class="card-price">${proj.price}</span>
                <p style="color:#888; font-size:0.85rem; margin-top:5px;">${proj.description.substring(0, 50)}...</p>
            </div>
        `;

        card.addEventListener('click', () => openModal(proj, statusClass));
        grid.appendChild(card);
    });
}

// --- MODAL SYSTEM ---
function openModal(proj, status) {
    document.getElementById('modal-img').src = proj.image;
    document.getElementById('modal-title').innerText = proj.title;
    document.getElementById('modal-desc').innerText = proj.description;
    document.getElementById('modal-price').innerText = proj.price;
    document.getElementById('modal-gamepass').innerText = proj.gamepass || "None";
    
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = (proj.tags || []).map(t => `<span>#${t}</span>`).join('');

    const actionArea = document.getElementById('modal-action-area');
    const statusMsg = document.getElementById('modal-status-msg');
    const contactInput = document.getElementById('contact-input');

    actionArea.classList.remove('hidden');
    statusMsg.classList.add('hidden');
    confirmBtn.onclick = null;
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = `Request Purchase <i class="fas fa-arrow-right"></i>`;

    if (status === 'sold') {
        actionArea.classList.add('hidden');
        statusMsg.classList.remove('hidden');
        statusMsg.innerHTML = `<p style="color:var(--danger); text-align:center; font-weight:bold;">SOLD OUT</p>`;
    } else if (status === 'owned') {
        actionArea.classList.add('hidden');
        statusMsg.classList.remove('hidden');
        statusMsg.innerHTML = `<p style="color:var(--success); text-align:center; font-weight:bold;">ALREADY OWNED</p>`;
    } else if (status === 'pending') {
        actionArea.classList.add('hidden');
        statusMsg.classList.remove('hidden');
        statusMsg.innerHTML = `<p style="color:var(--warning); text-align:center; font-weight:bold;">PENDING APPROVAL</p>`;
    } else {
        confirmBtn.onclick = () => {
            const contact = contactInput.value.trim();
            if(!contact) {
                alert("Please enter your Discord or Contact info.");
                return;
            }
            addPending(proj, contact);
        };
    }
    modal.classList.remove('hidden');
}

function closeModal() { modal.classList.add('hidden'); }
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target == modal) closeModal(); });

// --- ACTIONS ---
function addPending(proj, contact) {
    pendingList.push(proj.id);
    localStorage.setItem('velocity_pending', JSON.stringify(pendingList));
    
    // Button Feedback
    confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
    confirmBtn.disabled = true;

    // Simulate Network Delay for effect
    setTimeout(() => {
        sendWebhook(proj, currentUser, contact);
        closeModal();
        render(projects);
    }, 800);
}

function cleanPending() {
    const newPending = pendingList.filter(id => {
        const p = projects.find(x => x.id === id);
        return p && !p.purchased;
    });
    if (newPending.length !== pendingList.length) {
        pendingList = newPending;
        localStorage.setItem('velocity_pending', JSON.stringify(pendingList));
    }
}

function sendWebhook(product, user, contact) {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes("HIER")) return;
    
    const payload = {
        username: "Velocity Sales Bot",
        embeds: [{
            title: "🚀 New Order Request",
            color: 6512369, // Purple
            fields: [
                { name: "Product", value: product.title, inline: true },
                { name: "Price", value: product.price, inline: true },
                { name: "Buyer", value: user, inline: true },
                { name: "Contact", value: `\`${contact}\``, inline: false }
            ],
            footer: { text: "Velocity Rides Dashboard" },
            timestamp: new Date().toISOString()
        }]
    };
    fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

function filterProjects(type) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if (type === 'all') render(projects);
    else if (type === 'pending') render(projects.filter(p => pendingList.includes(p.id)));
    else if (type === 'purchased') render(projects.filter(p => p.purchased && p.buyer === currentUser));
}
