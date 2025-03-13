const stateTagApp = {
    namespace: 'x',
    disk: ['blackhole', localStorage, sessionStorage][1],
    cacheTimeout: 1 * 60 * 1000,
    log: console.log,

    format: {
        date: 'Y-MM-DD',
    },

    base: window.location.protocol
        .concat('://')
        .concat(window.location.host)
        .concat('/#/'),

    api: {
        production: "https://api.CostGuard.io",
        ngrok: "https://764db848ce99.ngrok.app",
        development: "http://api.CostGuard.test"
    },

    socket: {
        production: "https://api.costguard.io:3000",
        development: "http://api.costguard.test:3000"
    },

    nebula: {
        production: "https://json-data.io:8080",
        development: "http://json-data.io:8181"
    },

    palette: {
        bootstrap: [
            "#0d6efd", // Primary (Blue)
            "#6c757d", // Secondary (Gray)
            "#198754", // Success (Green)
            "#dc3545", // Danger (Red)
            "#ffc107", // Warning (Yellow)
            "#0dcaf0", // Info (Cyan)
            "#cdcdcd", // Light (Light Gray)
            "#212529", // Dark (Dark Gray)
            "#F0F0F0", // Lightest (Off White)
            "#000000"  // Black (Pure Black)
        ],
        cutestrap: [
            "#36A2EB", // Fixed Primary (Bright Blue)
            "#FF9F40", // Fixed Secondary (Medium Charcoal Gray)
            "#4BC0C0", // Success (Aqua)
            "#FF6384", // Fixed Danger (Soft Red-Pink)
            "#FFCE56", // Warning (Soft Yellow)
            "#9966FF", // Info (Violet)
            "#F0F0F0", // Light (Soft Off-White)
            "#606060", // Dark (Vibrant Orange)
            "#FFFFFF", // White (Pure White)
            "#000000"  // Black (Pure Black)
        ]
    }['cutestrap'],
}


