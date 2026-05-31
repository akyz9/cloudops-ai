const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all deployments
router.get('/', async (req, res) => {
  try {
    const { service_id } = req.query;

    let query = `
      SELECT d.*, s.name as service_name
      FROM deployments d
      LEFT JOIN services s ON d.service_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (service_id) {
      params.push(service_id);
      query += ` AND d.service_id = $${params.length}`;
    }

    query += ' ORDER BY d.deployed_at DESC';

    const result = await db.query(query, params);
    res.status(200).json({ deployments: result.rows });
  } catch (error) {
    console.error('Get deployments error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single deployment
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT d.*, s.name as service_name
       FROM deployments d
       LEFT JOIN services s ON d.service_id = s.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.status(200).json({ deployment: result.rows[0] });
  } catch (error) {
    console.error('Get deployment error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a deployment
router.post('/', async (req, res) => {
  try {
    const { version, service_id, notes } = req.body;

    if (!version || !service_id) {
      return res.status(400).json({ error: 'Version and service_id are required' });
    }

    const result = await db.query(
      `INSERT INTO deployments (version, service_id, notes, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [version, service_id, notes]
    );

    res.status(201).json({ deployment: result.rows[0] });
  } catch (error) {
    console.error('Create deployment error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update deployment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in_progress', 'success', 'failed', 'rolled_back'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid deployment status' });
    }

    const result = await db.query(
      `UPDATE deployments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.status(200).json({ deployment: result.rows[0] });
  } catch (error) {
    console.error('Update deployment error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;