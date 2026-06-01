#!/bin/bash
set -e

# Update system
yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker

# Install git
yum install -y git

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Create app directory
mkdir -p /app
cd /app

# Create .env file
cat > /app/.env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DB_HOST=${db_host}
DB_PORT=5432
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=24h
ANTHROPIC_API_KEY=${anthropic_api_key}
AWS_REGION=${aws_region}
ENVEOF

# Pull latest code from GitHub
git clone https://github.com/akyz9/cloudops-ai.git /app/repo

# Copy backend files
cp -r /app/repo/backend /app/backend
cp /app/.env /app/backend/.env

# Install dependencies
cd /app/backend
npm install --omit=dev

# Create systemd service to keep the app running
cat > /etc/systemd/system/cloudops-backend.service << 'SERVICEEOF'
[Unit]
Description=CloudOps AI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/app/backend
EnvironmentFile=/app/.env
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Start the service
systemctl daemon-reload
systemctl enable cloudops-backend
systemctl start cloudops-backend

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'CWEOF'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/cloudops/*.log",
            "log_group_name": "/cloudops-ai/${environment}",
            "log_stream_name": "{instance_id}/app"
          }
        ]
      }
    }
  }
}
CWEOF

systemctl start amazon-cloudwatch-agent
systemctl enable amazon-cloudwatch-agent

echo "CloudOps AI backend setup complete"