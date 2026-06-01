output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "ec2_public_ip" {
  description = "EC2 instance public IP"
  value       = module.compute.ec2_public_ip
}

output "ec2_public_dns" {
  description = "EC2 instance public DNS"
  value       = module.compute.ec2_public_dns
}

output "frontend_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.storage.frontend_bucket_name
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = module.storage.cloudfront_domain
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = module.monitoring.log_group_name
}

output "sns_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = module.monitoring.sns_topic_arn
}