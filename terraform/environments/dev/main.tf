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
    key            = "cloudops-ai/dev/terraform.tfstate"
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

data "aws_caller_identity" "current" {}

module "networking" {
  source = "../../modules/networking"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
}

module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = var.environment
  account_id   = data.aws_caller_identity.current.account_id
}

module "compute" {
  source = "../../modules/compute"

  project_name      = var.project_name
  environment       = var.environment
  instance_type     = var.instance_type
  public_subnet_id  = module.networking.public_subnet_ids[0]
  security_group_id = module.networking.ec2_security_group_id
  db_host           = "localhost"
  db_name           = "cloudops"
  db_user           = "cloudops_user"
  db_password       = var.db_password
  jwt_secret        = var.jwt_secret
  anthropic_api_key = var.anthropic_api_key
  aws_region        = var.aws_region
}

module "monitoring" {
  source = "../../modules/monitoring"

  project_name    = var.project_name
  environment     = var.environment
  aws_region      = var.aws_region
  ec2_instance_id = module.compute.ec2_instance_id
  alert_email     = var.alert_email
}