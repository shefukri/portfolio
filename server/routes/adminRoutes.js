const express = require('express');
const router = express.Router();

// Middleware to check authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'admin-session-token') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = (db) => {
    // Login Endpoint
    router.post('/login', (req, res) => {
        const { password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        console.log("Login Attempt:", { received: password, expected: adminPassword }); // DEBUG LOG

        if (password === adminPassword) {
            res.json({ success: true, token: 'admin-session-token' });
        } else {
            // TEMPORARY DEBUGGING RESPONSE
            res.status(401).json({ error: `Invalid password. Server received: '${password}' (Type: ${typeof password})` });
        }
    });

    // --- GENERIC HELPER FOR CRUD ---
    const updateSection = async (section, updateFn, res) => {
        try {
            // 1. Get current data
            const row = await db.get('SELECT content FROM portfolio_data WHERE section = ?', [section]);
            let data = row ? JSON.parse(row.content) : [];

            // 2. Apply update
            const newData = updateFn(data);

            // 3. Save back
            await db.run('INSERT OR REPLACE INTO portfolio_data (section, content) VALUES (?, ?)', [section, JSON.stringify(newData)]);

            res.json({ success: true, data: newData });
        } catch (error) {
            console.error(`Error updating ${section}:`, error);
            res.status(500).json({ error: 'Database error' });
        }
    };

    // --- PROJECTS ROUTES ---

    // Get all projects (Public/Admin)
    router.get('/projects', async (req, res) => {
        try {
            const row = await db.get('SELECT content FROM portfolio_data WHERE section = ?', ['projects']);
            res.json(row ? JSON.parse(row.content) : []);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create Project
    router.post('/projects', authenticate, (req, res) => {
        updateSection('projects', (projects) => {
            const newProject = { id: Date.now(), ...req.body };
            return [...projects, newProject];
        }, res);
    });

    // Update Project
    router.put('/projects/:id', authenticate, (req, res) => {
        updateSection('projects', (projects) => {
            return projects.map(p => p.id == req.params.id ? { ...p, ...req.body } : p);
        }, res);
    });

    // Delete Project
    router.delete('/projects/:id', authenticate, (req, res) => {
        updateSection('projects', (projects) => {
            return projects.filter(p => p.id != req.params.id);
        }, res);
    });

    // --- EXPERIENCE ROUTES ---

    // Get all experience (Public/Admin)
    router.get('/experience', async (req, res) => {
        try {
            const row = await db.get('SELECT content FROM portfolio_data WHERE section = ?', ['experience']);
            res.json(row ? JSON.parse(row.content) : []);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create Experience
    router.post('/experience', authenticate, (req, res) => {
        updateSection('experience', (experience) => {
            const newExp = { id: Date.now(), ...req.body };
            // Sort chronologically might be needed here, or handle in frontend. 
            // For now, just prepend/append. Let's prepend to show newest first.
            return [newExp, ...experience];
        }, res);
    });

    // Update Experience
    router.put('/experience/:id', authenticate, (req, res) => {
        updateSection('experience', (experience) => {
            return experience.map(e => e.id == req.params.id ? { ...e, ...req.body } : e);
        }, res);
    });

    // Delete Experience
    router.delete('/experience/:id', authenticate, (req, res) => {
        updateSection('experience', (experience) => {
            return experience.filter(e => e.id != req.params.id);
        }, res);
    });

    return router;
};
