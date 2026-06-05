# CloudOps AI

A production-grade cloud operations platform built on AWS. A real-time infrastructure monitoring dashboard with AI-powered incident analysis.

**Live:** https://d10boh2hido84x.cloudfront.net

---

## What It Does

- **Real-time monitoring** of services, incidents, alerts, and logs
- **Incident simulator** — simulate API outages, database failures, high CPU, and more
- **AI assistant** powered by Claude — analyses incidents using real log data, service health, and deployment history to provide root cause analysis and recommended fixes
- **Deployment tracking** — correlate incidents with recent deployments
- **Email alerting** via AWS SNS

---

## Tech Stack

### Cloud & Infrastructure
- **AWS EC2** — backend API server
- **AWS S3** — frontend static hosting
- **AWS CloudFront** — global CDN, HTTPS, API proxy
- **AWS CloudWatch** — monitoring, logging, alarms
- **AWS SNS** — email alerting
- **AWS IAM** — least privilege access control
- **Terraform** — all infrastructure provisioned as code with remote state in S3

### Backend
- **Node.js** + **Express** — REST API
- **PostgreSQL** — primary database
- **Docker** — containerised local development

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS**
- Fully mobile responsive with bottom navigation

### DevOps
- **GitHub Actions** — CI/CD pipeline, auto-deploys frontend to S3 and backend to EC2 on every push

### AI
- **Anthropic Claude API** — incident analysis with structured root cause, contributing factors, and recommended actions

---

## Architecture

---

## Features

- Dashboard with real-time metrics
- Service health monitoring
- Incident management with status tracking
- Alert management with acknowledge and resolve
- Live log stream with level filtering
- Deployment history
- Incident simulator with 7 real-world scenarios
- AI-powered root cause analysis

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/akyz9/cloudops-ai.git
cd cloudops-ai

# Start all services
docker-compose up --build

# Run database migrations
docker exec cloudops_backend node src/db/migrate.js

# Seed sample data
docker exec cloudops_backend node src/db/seed.js
```

Frontend: http://localhost:3000  
Backend: http://localhost:3001  
Health check: http://localhost:3001/health