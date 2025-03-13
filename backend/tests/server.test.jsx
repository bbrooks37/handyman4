const request = require('supertest');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { query, validationResult } = require('express-validator');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 5000;

const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

/**
 * GET /api/services
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
 * POST /api/contact
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

describe('API Tests', () => {
    it('should fetch services successfully', async () => {
        const response = await request(app).get('/api/services');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle form submission successfully', async () => {
        const response = await request(app)
            .post('/api/contact')
            .send({ name: 'John Doe', email: 'john@example.com', message: 'Hello!' });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});

module.exports = app;
