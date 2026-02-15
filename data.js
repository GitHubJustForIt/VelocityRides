// ============================================
// VELOCITY RIDES - TEMPLATE DATA
// ============================================
// Hier kannst du einfach neue Templates hinzufügen oder bestehende bearbeiten
// Jedes Template braucht: id, title, description, price, gamepass, image, purchased, buyer, tags

// Discord Webhook URL - Hier wird die Pending Notification hingeschickt
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1472624952917364998/dLUkhFwa2ZyEhrNbOHfwyRe3ufr8BtwzgH_kcni2fgtugwfaABMOq3vwdPTzfqJ9Q2OE';

// Template-Datenbank
const templates = [
    {
        id: '1',
        title: 'Boomerang',
        description: 'A family-friendly ride with a unqiue layout.',
        price: 80000,
        gamepass: 'Non-Collision (optional), Ride Operation (optional)',
        image: '',
        purchased: false,      // true = verkauft, false = verfügbar
        buyer: null,           // Username des Käufers (wenn verkauft)
        tags: ['Family', 'Attraction', 'Boomerang']
    }
];

// ============================================
// HELPER FUNCTIONS - Nicht bearbeiten
// ============================================

// Gibt alle Templates zurück
function getAllTemplates() {
    return templates;
}

// Gibt ein Template anhand der ID zurück
function getTemplateById(id) {
    return templates.find(t => t.id === id);
}

// Gibt den Discord Webhook URL zurück
function getWebhookUrl() {
    return DISCORD_WEBHOOK_URL;
}
