#!/bin/bash
set -e

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Create app directory
mkdir -p /app
cd /app

# Create .env file
cat > /app/.env << EOF
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
EOF

# Create docker-compose for production
cat > /app/docker-compose.yml << EOF
services:
  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "3001:3001"
    env_file:
      - .env
    command: node src/index.js
    restart: always
EOF

# Pull latest code from GitHub
yum install -y git
git clone https://github.com/akyz9/cloudops-ai.git /app/repo

# Copy backend files
cp -r /app/repo/backend /app/backend

# Install dependencies
cd /app/backend
npm install --omit=dev

# Start the application
cd /app
docker-compose up -d

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/app/logs/*.log",
            "log_group_name": "/cloudops-ai/${environment}",
            "log_stream_name": "{instance_id}/app"
          }
        ]
      }
    }
  }
}
EOF

# Start CloudWatch agent
systemctl start amazon-cloudwatch-agent
systemctl enable amazon-cloudwatch-agent