const express = require('express');
require('dotenv').config(); // Load env vars first
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { open } = require('sqlite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Allow all for debugging
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
let db;
(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });
        console.log('Connected to SQLite database.');

        // Initialize tables if they don't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS portfolio_data (
                id INTEGER PRIMARY KEY,
                section TEXT UNIQUE,
                content JSON
            )
        `);

        // DEBUG: Log all requests
        app.use((req, res, next) => {
            console.log(`[REQUEST] ${req.method} ${req.url}`);
            next();
        });

        // Mount Admin Routes (Pass db instance)
        console.log("Attempting to mount admin routes...");
        try {
            const adminRoutes = require('./routes/adminRoutes')(db);
            app.use('/api/admin', adminRoutes);
            console.log("Admin routes mounted successfully at /api/admin");
        } catch (err) {
            console.error("FAILED to mount admin routes:", err);
        }

        // Direct Test Route
        app.get('/sys/ping', (req, res) => res.send('pong'));

        // Start Server inside DB connection to ensure DB is ready
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error opening database:', error);
    }
})();

// Email configuration
// require('dotenv').config(); // Moved to top
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `Portfolio Contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: `Failed to send email: ${error.message}` });
    }
});

app.get('/api/portfolio', async (req, res) => {
    try {
        if (!db) throw new Error("Database not initialized");
        const rows = await db.all('SELECT * FROM portfolio_data');
        const data = {};
        rows.forEach(row => {
            data[row.section] = JSON.parse(row.content);
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve Static Frontend Assets (ONLY IN PRODUCTION)
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    console.log("PRODUCTION MODE: Serving static files from:", clientBuildPath);
    app.use(express.static(clientBuildPath));

    // Catch-All Route for SPA
    app.use((req, res) => {
        res.sendFile('index.html', { root: clientBuildPath });
    });
} else {
    console.log("DEVELOPMENT MODE: Static files content parsing skipped (use Vite on port 5173)");
}


