const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT a.*, s.name as service_name
      FROM alerts a
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.deleted_at IS NULL
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }

    query += ' ORDER BY a.created_at DESC';

    const result = await db.query(query, params);
    res.status(200).json({ alerts: result.rows });
  } catch (error) {
    console.error('Get alerts error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create an alert
router.post('/', async (req, res) => {
  try {
    const { title, message, severity, service_id } = req.body;

    if (!title || !message || !severity) {
      return res.status(400).json({ error: 'Title, message and severity are required' });
    }

    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({ error: 'Severity must be low, medium, high or critical' });
    }

    const result = await db.query(
      `INSERT INTO alerts (title, message, severity, service_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, message, severity, service_id]
    );

    res.status(201).json({ alert: result.rows[0] });
  } catch (error) {
    console.error('Create alert error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Acknowledge an alert
router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE alerts
       SET status = 'acknowledged',
           acknowledged_at = NOW(),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.status(200).json({ alert: result.rows[0] });
  } catch (error) {
    console.error('Acknowledge alert error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve an alert
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE alerts
       SET status = 'resolved',
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.status(200).json({ alert: result.rows[0] });
  } catch (error) {
    console.error('Resolve alert error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Soft delete an alert
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE alerts
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;