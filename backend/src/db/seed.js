const { Pool } = require('pg');
require('dotenv').config({ path: '../../../.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM ai_analysis');
    await client.query('DELETE FROM deployments');
    await client.query('DELETE FROM alerts');
    await client.query('DELETE FROM logs');
    await client.query('DELETE FROM incidents');
    await client.query('DELETE FROM services');
    await client.query('DELETE FROM users');

    // Create a default admin user
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('admin123', 12);

    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Admin User', 'admin@cloudops.ai', $1, 'admin')
    `, [passwordHash]);

    // Create services
    const servicesResult = await client.query(`
      INSERT INTO services (name, description, url, status, response_time, uptime, error_count)
      VALUES
        ('Frontend', 'React web application', 'http://localhost:3000', 'operational', 145, 99.98, 2),
        ('Backend API', 'Node.js REST API', 'http://localhost:3001', 'operational', 89, 99.95, 5),
        ('Database', 'PostgreSQL database', 'localhost:5432', 'operational', 12, 100.00, 0),
        ('Storage', 'S3 file storage', 'https://s3.amazonaws.com', 'operational', 230, 99.99, 1),
        ('Monitoring', 'CloudWatch monitoring', 'https://cloudwatch.amazonaws.com', 'operational', 178, 99.90, 3)
      RETURNING id, name
    `);

    const services = servicesResult.rows;
    const frontendId = services.find(s => s.name === 'Frontend').id;
    const backendId = services.find(s => s.name === 'Backend API').id;
    const databaseId = services.find(s => s.name === 'Database').id;

    // Create incidents
    await client.query(`
      INSERT INTO incidents (title, description, severity, status, service_id, created_at)
      VALUES
        ('Database connection timeout', 'Intermittent connection timeouts detected on the primary database', 'high', 'resolved', $1, NOW() - INTERVAL '2 days'),
        ('High API response time', 'API response times spiking above 2000ms during peak hours', 'medium', 'resolved', $2, NOW() - INTERVAL '1 day'),
        ('Frontend build failure', 'CI/CD pipeline failed during frontend build step', 'low', 'resolved', $3, NOW() - INTERVAL '12 hours'),
        ('Elevated error rate', 'Error rate on backend API exceeded 5% threshold', 'high', 'investigating', $2, NOW() - INTERVAL '2 hours'),
        ('Memory usage spike', 'Backend service memory usage reached 89% of available limit', 'medium', 'open', $2, NOW() - INTERVAL '30 minutes')
    `, [databaseId, backendId, frontendId]);

    // Create logs
    await client.query(`
      INSERT INTO logs (level, message, service_id, created_at)
      VALUES
        ('info', 'Server started successfully on port 3001', $1, NOW() - INTERVAL '3 hours'),
        ('info', 'Database connection established', $2, NOW() - INTERVAL '3 hours'),
        ('info', 'Health check passed', $1, NOW() - INTERVAL '2 hours'),
        ('warning', 'Response time exceeded 1000ms threshold', $1, NOW() - INTERVAL '1 hour'),
        ('error', 'Database connection timeout after 30s', $2, NOW() - INTERVAL '45 minutes'),
        ('error', 'Failed to process request: Internal server error', $1, NOW() - INTERVAL '30 minutes'),
        ('warning', 'Memory usage at 89% capacity', $1, NOW() - INTERVAL '20 minutes'),
        ('info', 'Cache cleared successfully', $1, NOW() - INTERVAL '10 minutes'),
        ('error', 'Health check failed for database service', $2, NOW() - INTERVAL '5 minutes'),
        ('info', 'Retry attempt 1 of 3 for database connection', $2, NOW() - INTERVAL '2 minutes')
    `, [backendId, databaseId]);

    // Create alerts
    await client.query(`
      INSERT INTO alerts (title, message, severity, status, service_id, created_at)
      VALUES
        ('High error rate detected', 'Error rate exceeded 5% threshold on Backend API', 'high', 'active', $1, NOW() - INTERVAL '2 hours'),
        ('Memory usage critical', 'Memory usage at 89% on Backend API service', 'medium', 'active', $1, NOW() - INTERVAL '30 minutes'),
        ('Database health check failed', 'Health check endpoint not responding', 'critical', 'acknowledged', $2, NOW() - INTERVAL '45 minutes'),
        ('Response time degraded', 'Average response time above 1000ms', 'low', 'resolved', $1, NOW() - INTERVAL '1 day')
    `, [backendId, databaseId]);

    // Create deployments
    await client.query(`
      INSERT INTO deployments (version, service_id, status, notes, deployed_at)
      VALUES
        ('v1.0.0', $1, 'success', 'Initial production deployment', NOW() - INTERVAL '7 days'),
        ('v1.0.1', $1, 'success', 'Bug fix: resolved authentication token expiry issue', NOW() - INTERVAL '5 days'),
        ('v1.1.0', $2, 'success', 'Feature: added incident simulator endpoints', NOW() - INTERVAL '3 days'),
        ('v1.1.1', $1, 'failed', 'Hotfix: failed due to missing environment variable', NOW() - INTERVAL '1 day'),
        ('v1.1.2', $1, 'success', 'Hotfix: corrected environment configuration', NOW() - INTERVAL '12 hours')
    `, [backendId, backendId]);

    await client.query('COMMIT');
    console.log('✅ Database seeded successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();