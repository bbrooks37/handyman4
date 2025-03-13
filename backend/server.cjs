const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { query, validationResult } = require('express-validator');

// Load environment variables from the .env file in the root directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

// Ensure all necessary environment variables are set
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Test the database connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Successfully connected to database!', result.rows[0].now);
    }
});

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(helmet()); // Secure app by setting various HTTP headers
app.use(morgan('combined')); // HTTP request logger

// Rate limiter middleware to limit repeated requests to public APIs
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware to handle asynchronous errors
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// API Endpoints

/**
 * GET /api/services
 * Fetches all services from the 'services' table.
 * Returns a JSON array of services.
 */
app.get('/api/services', [
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { limit = 10, offset = 0 } = req.query;

        // Convert limit and offset to integers
        const limitInt = parseInt(limit, 10);
        const offsetInt = parseInt(offset, 10);

        const result = await pool.query('SELECT * FROM services LIMIT $1 OFFSET $2', [limitInt, offsetInt]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

/**
 * GET /api/mulching
 * Fetches all mulching services from the 'mulching' table.
 * Returns a JSON array of mulching services.
 */
app.get('/api/mulching', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mulching');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching mulching services:', error);
        res.status(500).json({ error: 'Failed to fetch mulching services' });
    }
});

/**
 * GET /api/moving
 * Fetches all moving services from the 'moving' table.
 * Returns a JSON array of moving services.
 */
app.get('/api/moving', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM moving');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching moving services:', error);
        res.status(500).json({ error: 'Failed to fetch moving services' });
    }
});

/**
 * GET /api/handy_services
 * Fetches all handy services from the 'handy_services' table.
 * Returns a JSON array of handy services.
 */
app.get('/api/handy_services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM handy_services');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching handy services:', error);
        res.status(500).json({ error: 'Failed to fetch handy services' });
    }
});

app.get('/api/current_user', authenticateToken, (req, res) => {
    try {
        const user = req.user; // Assuming authenticateToken middleware sets req.user
        res.json({ user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/api/account', authenticateToken, (req, res) => {
    try {
        const user = req.user; // Assuming authenticateToken middleware sets req.user
        res.json({ user });
    } catch (error) {
        console.error('Error fetching account details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

/**
 * POST /api/login
 * Handles user login by checking credentials.
 */
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * POST /api/signup
 * Handles user registration by adding new user to the database.
 */
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password]);
        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * POST /api/contact
 * Handles contact form submissions.
 */
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Implement your form submission logic here, e.g., save to database or send email

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Post routes for current user updates.
app.post('/api/current_user/update_profile', authenticateToken, async (req, res) => {
    try {
        const { username, email, phone, address } = req.body;
        const userId = req.user.id; // Assuming your token contains the user ID

        // Update the user's profile in the database
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING *',
            [username, email, phone, address, userId]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/current_user/update_password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Verify the old password
        const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0 || userResult.rows[0].password !== oldPassword) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        // Update the password
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static assets
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});