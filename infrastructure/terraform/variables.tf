# =============================================================================
# NEXUS-PI — Terraform Variables
# =============================================================================

variable "aws_region" {
  type        = string
  description = "AWS deployment region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
  default     = "dev"
}

variable "owner" {
  type        = string
  description = "Project owner"
  default     = "NEXUS-PI-Team"
}

