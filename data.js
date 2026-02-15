// Konfiguration
const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1472624952917364998/dLUkhFwa2ZyEhrNbOHfwyRe3ufr8BtwzgH_kcni2fgtugwfaABMOq3vwdPTzfqJ9Q2OE"; 

// Initial Projects Data
// ID ist wichtig für die Identifikation
const initialProjects = [
    {
        id: 1,
        title: "Neon City Hub",
        description: "Ein futuristischer Cyberpunk-Spawn mit Neon-Effekten und optimierter Performance.",
        price: "$19.99",
        gamepass: "Lobby Pass",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80",
        tags: ["Cyberpunk", "Spawn", "Neon"],
        purchased: false,
        buyer: null
    },
    {
        id: 2,
        title: "Medieval Kingdom",
        description: "Großes Schloss-Template mit Marktplatz und detaillierten Texturen.",
        price: "$24.99",
        gamepass: "Kingdom Member",
        image: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
        tags: ["Medieval", "Large", "Castle"],
        purchased: true,
        buyer: "ShadowNinja"
    }
];
