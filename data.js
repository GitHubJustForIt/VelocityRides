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
        description: 'A family-friendly ride with a unique layout.',
        price: 80000,
        gamepass: 'Non-Collision (optional), Ride Operation (optional)',
        // Link zu deinem hochgeladenen Bild
        image: 'https://media.discordapp.net/attachments/1472624902153703567/1472661652922044710/fed14bd3-0711-4e73-9bd1-90ce3513b5e8.jpg?ex=6993628a&is=6992110a&hm=3e3cb4bfcb0732fe66b77eae99bfd6f4e90cefda2c5599a877be172ec3034e0e&=&format=webp&width=1446&height=800', 
        purchased: true,      // true = verkauft, false = verfügbar
        buyer: 'l0uis_vx',           // Username des Käufers (wenn verkauft)
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
