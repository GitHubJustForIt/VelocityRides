// Konfiguration
const WEBHOOK_URL = "HIER_DEINE_DISCORD_WEBHOOK_URL_EINFUEGEN"; 

// Initial Projects Data
// ID ist wichtig für die Identifikation
const initialProjects = [
    {
        id: 1,
        title: "Space Adventure Hub",
        description: "A complete sci-fi lobby with gravity systems.",
        price: "$14.99",
        gamepass: "Galaxy Pass Required",
        image: "https://via.placeholder.com/400x200/1e1e2e/ffffff?text=Space+Adventure", // Platzhalter
        tags: ["Sci-Fi", "Lobby", "Scripted"],
        purchased: false, // Standardmäßig verfügbar
        buyer: null
    },
    {
        id: 2,
        title: "Racing System V2",
        description: "Advanced car physics and lap timer.",
        price: "$29.99",
        gamepass: "None",
        image: "https://via.placeholder.com/400x200/312e81/ffffff?text=Racing+V2",
        tags: ["Cars", "System", "Physics"],
        purchased: true, 
        buyer: "OtherUser99" // Dieses Item ist SOLD (da nicht wir der Käufer sind)
    },
    {
        id: 3,
        title: "Mystery Mansion",
        description: "Horror map with jumpscares pre-configured.",
        price: "$9.99",
        gamepass: "Horror Pack",
        image: "https://via.placeholder.com/400x200/3f0e40/ffffff?text=Mystery+Mansion",
        tags: ["Horror", "Map"],
        purchased: false,
        buyer: null
    },
    {
        id: 4,
        title: "Tycoon Kit Starter",
        description: "Everything you need to build a tycoon.",
        price: "$4.99",
        gamepass: "None",
        image: "https://via.placeholder.com/400x200/064e3b/ffffff?text=Tycoon+Kit",
        tags: ["Tycoon", "Starter"],
        purchased: false,
        buyer: null
    }
];
