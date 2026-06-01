variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "account_id" {
  description = "AWS account ID"
  type        = string
}

variable "ec2_public_dns" {
  description = "EC2 instance public DNS for API proxying"
  type        = string
}