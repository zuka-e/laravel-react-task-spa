# https://www.terraform.io/docs/language/values/variables.html

################################################################################
# Main
################################################################################
variable "project" {
  description = "project name"
  type        = string
  default     = "tf-project"
}

variable "stage" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "aws_profile" {
  description = "AWS profile"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

################################################################################
# Route53
################################################################################
variable "root_domain" {
  description = "Hosted zone and records for the root domain"
  type = object({
    name = string
    records = object({
      a     = list(string)
      cname = list(string)
    })
  })
}

################################################################################
# VPC
################################################################################
variable "vpc_cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_private_subnets" {
  description = "Private subnets for VPC"
  type        = list(string)
  default = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24",
    "10.0.4.0/24",
    "10.0.5.0/24",
    "10.0.6.0/24"
  ]
}

################################################################################
# RDS
################################################################################
variable "db_username" {
  description = "The master username for the database"
  type        = string
  sensitive   = true
}
