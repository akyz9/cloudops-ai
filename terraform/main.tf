terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "cloudops-ai-terraform-state-945239280755"
    key            = "cloudops-ai/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "cloudops-ai-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "cloudops-ai"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}