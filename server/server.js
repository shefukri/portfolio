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

        // Check if DB is empty and seed if necessary
        const { count } = await db.get('SELECT COUNT(*) as count FROM portfolio_data');
        if (count === 0) {
            console.log("Database empty. Auto-seeding...");
            const seedData = {
                about: {
                    title: "Shefali",
                    role: "Full Stack Developer",
                    tagline: "Building digital experiences that matter.",
                    intro: "I am a results-driven developer focused on building scalable, user-centric web applications. I bridge the gap between complex backend logic and intuitive frontend design.",
                    highlights: [
                        "Expertise in modern JavaScript frameworks (React, Node.js).",
                        "Proven ability to design efficient, scalable database schemas.",
                        "Passionate about clean code and performance optimization."
                    ],
                    closing: "I am currently seeking opportunities to leverage my full-stack skills in a challenging environment where innovation is valued.",
                    image: "https://via.placeholder.com/150"
                },
                contact: {
                    email: "user@example.com",
                    socials: {
                        github: "https://github.com/shefukri",
                        linkedin: "https://www.linkedin.com/in/shefali-582845289/",
                        instagram: "https://instagram.com"
                    }
                },
                stats: [
                    { label: "Years Experience", value: 3, suffix: "+" },
                    { label: "Projects Completed", value: 15, suffix: "+" },
                    { label: "Technologies", value: 10, suffix: "+" }
                ],
                projects: [
                    {
                        id: 1,
                        title: "Amazon Clone",
                        description: "Developed a static e-commerce website interface replicating Amazon’s homepage layout, navigation bar, and product grid to practice responsive web design.",
                        tech: ["HTML", "CSS"],
                        link: "#"
                    },
                    {
                        id: 2,
                        title: "Spotify Clone",
                        description: "Built a responsive music player interface featuring a playlist section, playback controls, and interactive UI for a real-world streaming experience.",
                        tech: ["HTML", "CSS", "JavaScript"],
                        link: "#"
                    },
                    {
                        id: 3,
                        title: "Todo App",
                        description: "A persistent Todo application using Local Storage to save data across refreshes.",
                        tech: ["HTML", "CSS", "TailwindCSS", "JavaScript"],
                        link: "https://shefukri.github.io/Todo-App/"
                    },
                    {
                        id: 4,
                        title: "Simon Says Game",
                        description: "Interactive memory game with sound generation using the Web Audio API.",
                        tech: ["HTML", "CSS", "JavaScript"],
                        link: "https://shefukri.github.io/Simon-says-/"
                    }
                ],
                education: [
                    { id: 1, institution: "National Institute of Technology, Meghalaya", degree: "B.Tech (Computer Science and Engineering)", year: "2023–2027", score: "CGPA: 9.37" },
                    { id: 2, institution: "Arvind Mahila College", degree: "Intermediate/XII", year: "2022", score: "89%" },
                    { id: 3, institution: "B.D Public School", degree: "Matric/X", year: "2020", score: "93%" }
                ],
                experience: [
                    {
                        id: 1,
                        company: "Tech Workshop (Cognitia)",
                        role: "Volunteer",
                        year: "Aug 2024",
                        description: "Assisted in organizing workshops and seminars for budding developers. Delivered presentations on web technologies and best practices.",
                        location: "Shillong, Meghalaya"
                    },
                    {
                        id: 2,
                        company: "NASA Space Apps Challenge",
                        role: "Global Nominee (Agrivision)",
                        year: "2023-2024",
                        description: "Selected as a Global Nominee for solving challenges as a galactic problem solver. Project: Agrivision.",
                        location: "Remote"
                    },
                    {
                        id: 3,
                        company: "NIT Meghalaya Hackathon",
                        role: "Participant",
                        year: "Nov 2023",
                        description: "Designed a game development website along with learning content. Learned to communicate effectively as a team member.",
                        location: "Shillong, Meghalaya"
                    }
                ],
                skills: ["JavaScript", "React", "Node.js", "Express", "SQL", "HTML/CSS", "Git"]
            };

            const stmt = await db.prepare('INSERT INTO portfolio_data (section, content) VALUES (?, ?)');
            for (const [section, content] of Object.entries(seedData)) {
                await stmt.run(section, JSON.stringify(content));
            }
            await stmt.finalize();
            console.log("Auto-seeding completed.");
        }

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

        // Serve Static Frontend Assets (ONLY IN PRODUCTION)
        // MOVED HERE: Must be registered AFTER API routes
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


