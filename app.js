// ============================================
// VELOCITY RIDES - MAIN APP LOGIC
// ============================================

let currentUser = null;
let currentFilter = 'all';
let selectedTemplate = null;

// ============================================
// Initialize Dashboard
// ============================================

function initDashboard(username) {
    currentUser = username;
    renderTemplates();
    setupFilterButtons();
    setupModal();
}

// ============================================
// Template Rendering
// ============================================

function renderTemplates() {
    const grid = document.getElementById('templates-grid');
    const emptyState = document.getElementById('empty-state');
    const allTemplates = getAllTemplates();
    
    // Filter templates based on current filter
    const filteredTemplates = filterTemplates(allTemplates);
    
    // Clear grid
    grid.innerHTML = '';
    
    // Show/hide empty state
    if (filteredTemplates.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
    }
    
    // Render each template
    filteredTemplates.forEach((template, index) => {
        const card = createTemplateCard(template, index);
        grid.appendChild(card);
    });
}

// Filter templates based on current filter and user
function filterTemplates(templates) {
    const allPending = getPendingPurchases();
    
    return templates.filter(template => {
        // Check if template is in pending by someone else and already sold
        const pendingPurchase = allPending.find(p => p.templateId === template.id);
        if (template.purchased && pendingPurchase && pendingPurchase.username !== currentUser) {
            return false; // Hide sold templates in someone else's pending
        }
        
        const isPendingByUser = isPending(template.id, currentUser);
        const isOwnedByUser = template.purchased && template.buyer === currentUser;
        
        // Apply filter
        switch (currentFilter) {
            case 'pending':
                return isPendingByUser;
            case 'purchased':
                return isOwnedByUser;
            case 'all':
            default:
                return true;
        }
    });
}

// Create template card element
function createTemplateCard(template, index) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const isPendingByUser = isPending(template.id, currentUser);
    const isOwnedByUser = template.purchased && template.buyer === currentUser;
    
    // Determine badge
    let badgeHTML = '';
    if (template.purchased && !isOwnedByUser) {
        badgeHTML = '<span class="badge badge-sold">SOLD</span>';
    } else if (isPendingByUser) {
        badgeHTML = '<span class="badge badge-pending">PENDING</span>';
    } else if (isOwnedByUser) {
        badgeHTML = '<span class="badge badge-owned">OWNED</span>';
    }
    
    // Generate tags HTML
    const tagsHTML = template.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${template.image}" alt="${template.title}" class="card-image">
            <div class="card-image-overlay"></div>
            ${badgeHTML}
            <div class="card-price-tag">
                <span class="card-price">$${template.price}</span>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${template.title}</h3>
            <p class="card-description">${template.description}</p>
            <div class="card-gamepass">
                <i class="fas fa-shopping-cart"></i>
                <span>${template.gamepass}</span>
            </div>
            <div class="card-tags">
                <i class="fas fa-tag"></i>
                ${tagsHTML}
            </div>
        </div>
    `;
    
    // Click handler
    card.addEventListener('click', () => openModal(template));
    
    return card;
}

// ============================================
// Filter Buttons
// ============================================

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update filter
            currentFilter = btn.dataset.filter;
            
            // Re-render templates
            renderTemplates();
        });
    });
}

// ============================================
// Modal Logic
// ============================================

function setupModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const purchaseForm = document.getElementById('purchase-form');
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Handle purchase form
    purchaseForm.addEventListener('submit', handlePurchaseSubmit);
}

function openModal(template) {
    selectedTemplate = template;
    const overlay = document.getElementById('modal-overlay');
    
    const isPendingByUser = isPending(template.id, currentUser);
    const isOwnedByUser = template.purchased && template.buyer === currentUser;
    const canPurchase = !template.purchased && !isPendingByUser;
    
    // Populate modal
    document.getElementById('modal-image').src = template.image;
    document.getElementById('modal-title').textContent = template.title;
    document.getElementById('modal-description').textContent = template.description;
    document.getElementById('modal-price').textContent = `$${template.price}`;
    document.getElementById('modal-gamepass').textContent = template.gamepass;
    document.getElementById('modal-username').textContent = currentUser;
    
    // Badge
    const badge = document.getElementById('modal-badge');
    if (template.purchased && !isOwnedByUser) {
        badge.className = 'badge badge-sold';
        badge.textContent = 'SOLD';
        badge.style.display = 'block';
    } else if (isPendingByUser) {
        badge.className = 'badge badge-pending';
        badge.textContent = 'PENDING';
        badge.style.display = 'block';
    } else if (isOwnedByUser) {
        badge.className = 'badge badge-owned';
        badge.textContent = 'OWNED';
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
    
    // Tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = template.tags.map(tag => 
        `<span class="tag-large">${tag}</span>`
    ).join('');
    
    // Show/hide form and status messages
    document.getElementById('purchase-form').style.display = canPurchase ? 'block' : 'none';
    document.getElementById('status-pending').style.display = isPendingByUser ? 'flex' : 'none';
    document.getElementById('status-owned').style.display = isOwnedByUser ? 'flex' : 'none';
    
    const statusSold = document.getElementById('status-sold');
    if (template.purchased && !isOwnedByUser) {
        statusSold.style.display = 'flex';
        document.getElementById('status-sold-text').textContent = 
            `This template has been purchased by ${template.buyer}.`;
    } else {
        statusSold.style.display = 'none';
    }
    
    // Show modal
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    selectedTemplate = null;
    
    // Reset form
    document.getElementById('contact-input').value = '';
}

// ============================================
// Purchase Logic
// ============================================

async function handlePurchaseSubmit(event) {
    event.preventDefault();
    
    if (!selectedTemplate) return;
    
    const contactInput = document.getElementById('contact-input');
    const contact = contactInput.value.trim();
    
    if (!contact) {
        showToast('Please enter your contact information', 'error');
        return;
    }
    
    // Disable form
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        // Send Discord notification
        const success = await sendDiscordWebhook(selectedTemplate, contact);
        
        if (success) {
            // Add to pending
            addPendingPurchase(selectedTemplate.id, currentUser, contact);
            
            // Show success message
            showToast('Purchase request submitted successfully!', 'success');
            
            // Close modal after delay
            setTimeout(() => {
                closeModal();
                renderTemplates(); // Re-render to update badges
            }, 1500);
        } else {
            throw new Error('Failed to send notification');
        }
    } catch (error) {
        console.error('Purchase error:', error);
        showToast('Failed to submit purchase request. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================
// Discord Webhook
// ============================================

// Hier deine Discord Webhook URL einfügen
function getWebhookUrl() {
    return "https://discordapp.com/api/webhooks/1472624952917364998/dLUkhFwa2ZyEhrNbOHfwyRe3ufr8BtwzgH_kcni2fgtugwfaABMOq3vwdPTzfqJ9Q2OE";
}

async function sendDiscordWebhook(template, contact) {
    const webhookUrl = getWebhookUrl();
    
    // Validierung der URL
    if (!webhookUrl || webhookUrl.includes("HIER_EINFÜGEN")) {
        console.error("❌ Webhook URL fehlt oder ist ungültig!");
        return false;
    }

    const embed = {
        title: '🎮 New Purchase Request - Velocity Rides',
        color: 3447003, // Professional Blue
        fields: [
            {
                name: '👤 Username',
                value: currentUser || "Unknown User",
                inline: true
            },
            {
                name: '🆔 Product ID',
                value: String(template.id),
                inline: true
            },
            {
                name: '📞 Contact Information',
                value: contact,
                inline: false
            },
            {
                name: 'Product',
                value: template.title,
                inline: false
            },
            {
                name: 'Price',
                value: `$${template.price}`,
                inline: true
            },
            {
                name: 'Gamepass',
                value: template.gamepass,
                inline: true
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Velocity Rides Dashboard'
        }
    };

    // Thumbnail nur hinzufügen, wenn ein Bild vorhanden ist
    if (template.image) {
        embed.thumbnail = { url: template.image };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: `🔔 **Neue Bestellung von ${currentUser}!**`,
                embeds: [embed]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Discord API Error:', errorData);
            throw new Error(`Webhook request failed with status ${response.status}`);
        }

        console.log('✅ Discord notification sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to send Discord notification:', error);
        return false;
    }
}

// ============================================
// Initialize on DOM ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = getUser();
    if (user && user.username) {
        initDashboard(user.username);
    }
});
