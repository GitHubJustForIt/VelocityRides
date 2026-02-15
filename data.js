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
        title: 'Velocity Elite Package',
        description: 'Premium racing template with advanced handling and performance features. Perfect for competitive players.',
        price: 499,
        gamepass: 'Elite Racing Pass',
        image: 'https://images.unsplash.com/photo-1742056024244-02a093dae0b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzcxMTQ4NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        purchased: false,      // true = verkauft, false = verfügbar
        buyer: null,           // Username des Käufers (wenn verkauft)
        tags: ['Premium', 'Racing', 'Performance']
    },
    {
        id: '2',
        title: 'Dashboard Pro UI',
        description: 'Modern dashboard interface with customizable HUD elements and real-time stats display.',
        price: 299,
        gamepass: 'Pro UI Pass',
        image: 'https://images.unsplash.com/photo-1581028337168-887b61f494e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXIlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzcxMTc3MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        purchased: true,       // Beispiel: Bereits verkauft
        buyer: 'MaxSpeed',     // An diesen User verkauft
        tags: ['UI', 'Dashboard', 'Customizable']
    },
    {
        id: '3',
        title: 'Luxury Interior Pack',
        description: 'High-quality interior templates with detailed textures and realistic materials.',
        price: 399,
        gamepass: 'Luxury Pass',
        image: 'https://images.unsplash.com/photo-1769253678069-a35aebb89e0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzExNzcxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        purchased: false,
        buyer: null,
        tags: ['Interior', 'Luxury', 'Detailed']
    },
    {
        id: '4',
        title: 'Racing Wheels Collection',
        description: 'Complete collection of sport wheels with custom rim designs and tire options.',
        price: 199,
        gamepass: 'Wheels Pack',
        image: 'https://images.unsplash.com/photo-1755398311235-7efdef896a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjB3aGVlbHN8ZW58MXx8fHwxNzcxMTc3MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        purchased: false,
        buyer: null,
        tags: ['Wheels', 'Customization', 'Sport']
    },
    {
        id: '5',
        title: 'Futuristic Vehicle Set',
        description: 'Sci-fi inspired vehicle templates with neon effects and advanced visual features.',
        price: 599,
        gamepass: 'Future Tech Pass',
        image: 'https://images.unsplash.com/photo-1606138369223-fb3a260d9b99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2FyfGVufDF8fHx8MTc3MTE3NzE4MXww&ixlib=rb-4.1.0&q=80&w=1080',
        purchased: false,
        buyer: null,
        tags: ['Futuristic', 'Sci-Fi', 'Effects']
    },
    {
        id: '6',
        title: 'Engine Mechanics Pack',
        description: 'Detailed engine templates with realistic mechanics and performance tuning options.',
        price: 449,
        gamepass: 'Mechanic Pro Pass',
        image: 'https://images.unsplash.com/photo-1653491887161-aaf72d4514f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBkZXRhaWx8ZW58MXx8fHwxNzcxMTc3MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        purchased: true,       // Beispiel: Bereits verkauft
        buyer: 'TurboKing',    // An diesen User verkauft
        tags: ['Engine', 'Mechanics', 'Performance']
    }

    // ============================================
    // NEUE TEMPLATES HINZUFÜGEN:
    // ============================================
    // Einfach ein neues Objekt hier einfügen nach diesem Muster:
    /*
    ,{
        id: '7',  // Eindeutige ID (einfach die nächste Nummer)
        title: 'Dein Template Name',
        description: 'Beschreibung des Templates',
        price: 399,  // Preis in deiner Währung
        gamepass: 'Gamepass Name',
        image: 'BILD_URL_HIER',  // URL zum Bild
        purchased: false,  // false = verfügbar, true = verkauft
        buyer: null,  // null = nicht verkauft, oder Username des Käufers
        tags: ['Tag1', 'Tag2', 'Tag3']  // Beliebige Tags
    }
    */
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
