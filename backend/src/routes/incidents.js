const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT i.*, s.name as service_name
       FROM incidents i
       LEFT JOIN services s ON i.service_id = s.id
       WHERE i.deleted_at IS NULL
       ORDER BY i.created_at DESC`
    );
    res.status(200).json({ incidents: result.rows });
  } catch (error) {
    console.error('Get incidents error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single incident
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT i.*, s.name as service_name
       FROM incidents i
       LEFT JOIN services s ON i.service_id = s.id
       WHERE i.id = $1 AND i.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.status(200).json({ incident: result.rows[0] });
  } catch (error) {
    console.error('Get incident error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create an incident
router.post('/', async (req, res) => {
  try {
    const { title, description, severity, service_id } = req.body;

    if (!title || !severity) {
      return res.status(400).json({ error: 'Title and severity are required' });
    }

    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({ error: 'Severity must be low, medium, high or critical' });
    }

    const result = await db.query(
      `INSERT INTO incidents (title, description, severity, service_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, severity, service_id]
    );

    res.status(201).json({ incident: result.rows[0] });
  } catch (error) {
    console.error('Create incident error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update incident status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'investigating', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be open, investigating or resolved' });
    }

    const resolvedAt = status === 'resolved' ? 'NOW()' : 'NULL';

    const result = await db.query(
      `UPDATE incidents
       SET status = $1,
           resolved_at = ${resolvedAt},
           updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.status(200).json({ incident: result.rows[0] });
  } catch (error) {
    console.error('Update incident error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Soft delete an incident
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE incidents
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Delete incident error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;