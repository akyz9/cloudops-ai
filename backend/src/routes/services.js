const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM services ORDER BY created_at ASC'
    );
    res.status(200).json({ services: result.rows });
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ service: result.rows[0] });
  } catch (error) {
    console.error('Get service error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a service
router.post('/', async (req, res) => {
  try {
    const { name, description, url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Service name is required' });
    }

    const result = await db.query(
      `INSERT INTO services (name, description, url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, url]
    );

    res.status(201).json({ service: result.rows[0] });
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a service status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response_time, error_count, uptime } = req.body;

    const result = await db.query(
      `UPDATE services
       SET status = COALESCE($1, status),
           response_time = COALESCE($2, response_time),
           error_count = COALESCE($3, error_count),
           uptime = COALESCE($4, uptime),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [status, response_time, error_count, uptime, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ service: result.rows[0] });
  } catch (error) {
    console.error('Update service error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM services WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;