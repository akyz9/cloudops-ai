const express = require('express');
const db = require('../db');

const router = express.Router();

// Analyse an incident using Claude AI
router.post('/analyse/:incidentId', async (req, res) => {
  try {
    const { incidentId } = req.params;

    // Get the incident
    const incidentResult = await db.query(
      `SELECT i.*, s.name as service_name
       FROM incidents i
       LEFT JOIN services s ON i.service_id = s.id
       WHERE i.id = $1 AND i.deleted_at IS NULL`,
      [incidentId]
    );

    if (incidentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const incident = incidentResult.rows[0];

    // Get recent logs for the affected service
    const logsResult = await db.query(
      `SELECT level, message, created_at
       FROM logs
       WHERE service_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [incident.service_id]
    );

    // Get service health
    const serviceResult = await db.query(
      'SELECT * FROM services WHERE id = $1',
      [incident.service_id]
    );

    // Get recent deployments
    const deploymentsResult = await db.query(
      `SELECT version, status, notes, deployed_at
       FROM deployments
       WHERE service_id = $1
       ORDER BY deployed_at DESC
       LIMIT 3`,
      [incident.service_id]
    );

    const service = serviceResult.rows[0];
    const logs = logsResult.rows;
    const deployments = deploymentsResult.rows;

    // Build the prompt for Claude
    const prompt = `You are a cloud operations expert. Analyse this incident and provide a structured diagnosis.

INCIDENT:
- Title: ${incident.title}
- Description: ${incident.description || 'No description provided'}
- Severity: ${incident.severity}
- Status: ${incident.status}
- Service: ${incident.service_name || 'Unknown'}
- Created: ${incident.created_at}

SERVICE HEALTH:
- Status: ${service ? service.status : 'Unknown'}
- Response Time: ${service ? service.response_time + 'ms' : 'Unknown'}
- Uptime: ${service ? service.uptime + '%' : 'Unknown'}
- Error Count: ${service ? service.error_count : 'Unknown'}

RECENT LOGS (last 10):
${logs.length > 0 ? logs.map(l => `[${l.level.toUpperCase()}] ${l.message} (${new Date(l.created_at).toISOString()})`).join('\n') : 'No recent logs available'}

RECENT DEPLOYMENTS:
${deployments.length > 0 ? deployments.map(d => `- ${d.version}: ${d.status} - ${d.notes || 'No notes'} (${new Date(d.deployed_at).toISOString()})`).join('\n') : 'No recent deployments'}

Provide your analysis in this exact JSON format:
{
  "root_cause": "The most likely root cause in 2-3 sentences",
  "contributing_factors": ["factor 1", "factor 2", "factor 3"],
  "recommended_actions": ["action 1", "action 2", "action 3"],
  "severity_assessment": "Your assessment of the severity and urgency",
  "estimated_resolution_time": "Estimated time to resolve"
}`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const rawResponse = data.content[0].text;

    // Parse the JSON response from Claude
    let analysis;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      analysis = null;
    }

    // Save the analysis to the database
    await db.query(
      `INSERT INTO ai_analysis (incident_id, root_cause, contributing_factors, recommendations, raw_response)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        incidentId,
        analysis?.root_cause || rawResponse,
        analysis?.contributing_factors ? JSON.stringify(analysis.contributing_factors) : null,
        analysis?.recommended_actions ? JSON.stringify(analysis.recommended_actions) : null,
        rawResponse
      ]
    );

    res.status(200).json({
      incident_id: incidentId,
      analysis: analysis || { raw: rawResponse }
    });

  } catch (error) {
    console.error('AI analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyse incident: ' + error.message });
  }
});

// Get previous analysis for an incident
router.get('/analysis/:incidentId', async (req, res) => {
  try {
    const { incidentId } = req.params;

    const result = await db.query(
      `SELECT * FROM ai_analysis
       WHERE incident_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [incidentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No analysis found for this incident' });
    }

    const analysis = result.rows[0];

    res.status(200).json({
      incident_id: incidentId,
      analysis: {
        root_cause: analysis.root_cause,
        contributing_factors: analysis.contributing_factors ? JSON.parse(analysis.contributing_factors) : [],
        recommended_actions: analysis.recommendations ? JSON.parse(analysis.recommendations) : [],
        created_at: analysis.created_at
      }
    });

  } catch (error) {
    console.error('Get analysis error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;