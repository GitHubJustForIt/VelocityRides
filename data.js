// Konfiguration
const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1472624952917364998/dLUkhFwa2ZyEhrNbOHfwyRe3ufr8BtwzgH_kcni2fgtugwfaABMOq3vwdPTzfqJ9Q2OE"; 

// Initial Projects Data
// ID ist wichtig für die Identifikation
const projects = [
    {
        id: 1,
        title: "Neon City Drift",
        description: "High speed racing template with neon aesthetics.",
        price: "$14.99",
        gamepass: "Required: Speed Pass v2",
        image: "https://via.placeholder.com/300x180/1a1a1a/ffffff?text=Neon+City",
        purchased: false,
        buyer: "",
        tags: ["Racing", "Neon"]
    },
    {
        id: 2,
        title: "Medieval Fortress",
        description: "Complete castle asset with interior rooms.",
        price: "$24.99",
        gamepass: "Not Required",
        image: "https://via.placeholder.com/300x180/1a1a1a/ffffff?text=Medieval",
        purchased: true,
        buyer: "OldUser123",
        tags: ["Building", "RP"]
    },
    {
        id: 3,
        title: "Cyberpunk Apartment",
        description: "Modern interior for futuristic roleplay.",
        price: "$19.99",
        gamepass: "Required: VIP Member",
        image: "https://via.placeholder.com/300x180/1a1a1a/ffffff?text=Cyberpunk",
        purchased: false,
        buyer: "",
        tags: ["Interior", "Cyberpunk"]
    }
];
