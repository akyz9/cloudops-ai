variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "ec2_instance_id" {
  description = "EC2 instance ID for CloudWatch alarms"
  type        = string
}

variable "alert_email" {
  description = "Email address for SNS alerts"
  type        = string
}