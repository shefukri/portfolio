const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

(async () => {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    const data = {
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

    // Create table if it doesn't exist (in case seed is run before server)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS portfolio_data (
            id INTEGER PRIMARY KEY,
            section TEXT UNIQUE,
            content JSON
        )
    `);

    await db.exec('DELETE FROM portfolio_data'); // Clear existing

    const stmt = await db.prepare('INSERT INTO portfolio_data (section, content) VALUES (?, ?)');

    for (const [section, content] of Object.entries(data)) {
        await stmt.run(section, JSON.stringify(content));
    }

    await stmt.finalize();
    console.log('Database seeded successfully.');
})();
