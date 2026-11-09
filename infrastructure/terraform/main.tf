# =============================================================================
# NEXUS-PI — Terraform Comparison Exercise (AWS Provider)
# Reference: Synopsis Section 10.2.1
# =============================================================================
# This isolated module demonstrates how the NEXUS-PI infrastructure translates
# from AWS CloudFormation to HashiCorp Terraform syntax.
# Resources are named with a distinct `tf-nexus-` prefix to prevent any
# collision or dual-management with the primary CloudFormation stack.
# =============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "NEXUS-PI"
      Environment = var.environment
      ManagedBy   = "Terraform-Comparison"
      Owner       = var.owner
    }
  }
}

# -----------------------------------------------------------------------------
# 1. VPC & Networking
# -----------------------------------------------------------------------------
resource "aws_vpc" "nexus_vpc" {
  cidr_block           = "10.1.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "tf-nexus-vpc-${var.environment}"
  }
}

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.nexus_vpc.id
  cidr_block              = "10.1.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "tf-nexus-subnet-public-1"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.nexus_vpc.id

  tags = {
    Name = "tf-nexus-igw"
  }
}

# -----------------------------------------------------------------------------
# 2. Container Registries (Amazon ECR)
# -----------------------------------------------------------------------------
resource "aws_ecr_repository" "api_repo" {
  name                 = "tf-nexus-pi-api"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend_repo" {
  name                 = "tf-nexus-pi-frontend"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# -----------------------------------------------------------------------------
# 3. CloudWatch Log Group
# -----------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/tf-nexus-pi/api-${var.environment}"
  retention_in_days = 30
}

