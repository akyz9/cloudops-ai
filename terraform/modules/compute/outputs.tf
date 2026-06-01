output "ec2_public_ip" {
  description = "EC2 instance public IP"
  value       = aws_instance.backend.public_ip
}

output "ec2_public_dns" {
  description = "EC2 instance public DNS"
  value       = aws_instance.backend.public_dns
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.backend.id
}