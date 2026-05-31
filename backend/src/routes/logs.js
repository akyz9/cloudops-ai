const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all logs
router.get('/', async (req, res) => {
  try {
    const { level, service_id, limit = 100 } = req.query;

    let query = `
      SELECT l.*, s.name as service_name
      FROM logs l
      LEFT JOIN services s ON l.service_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (level) {
      params.push(level);
      query += ` AND l.level = $${params.length}`;
    }

    if (service_id) {
      params.push(service_id);
      query += ` AND l.service_id = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY l.created_at DESC LIMIT $${params.length}`;

    const result = await db.query(query, params);
    res.status(200).json({ logs: result.rows });
  } catch (error) {
    console.error('Get logs error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a log entry
router.post('/', async (req, res) => {
  try {
    const { level, message, service_id, metadata } = req.body;

    if (!level || !message) {
      return res.status(400).json({ error: 'Level and message are required' });
    }

    const validLevels = ['info', 'warning', 'error'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: 'Level must be info, warning or error' });
    }

    const result = await db.query(
      `INSERT INTO logs (level, message, service_id, metadata)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [level, message, service_id, metadata ? JSON.stringify(metadata) : null]
    );

    res.status(201).json({ log: result.rows[0] });
  } catch (error) {
    console.error('Create log error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete all logs for a service
router.delete('/service/:service_id', async (req, res) => {
  try {
    const { service_id } = req.params;
    await db.query('DELETE FROM logs WHERE service_id = $1', [service_id]);
    res.status(200).json({ message: 'Logs cleared successfully' });
  } catch (error) {
    console.error('Delete logs error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;