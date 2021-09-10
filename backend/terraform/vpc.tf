locals {
  cidr            = var.vpc_cidr_block
  private_subnets = var.vpc_private_subnets
}

################################################################################
# VPC with subnets
################################################################################
# https://github.com/terraform-aws-modules/terraform-aws-vpc
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "main-vpc"
  cidr = local.cidr

  azs = [
    "${local.region}a",
    "${local.region}b",
    "${local.region}c",
    "${local.region}d",
    "${local.region}e",
    "${local.region}f"
  ]

  private_subnets = local.private_subnets

  enable_dns_hostnames = true
  enable_dns_support   = true
}


################################################################################
# Security Group
################################################################################
# https://github.com/terraform-aws-modules/terraform-aws-security-group#security-group-with-custom-rules
module "vote_service_sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "main-sg"
  description = "Security group"
  vpc_id      = module.vpc.vpc_id

  # https://github.com/terraform-aws-modules/terraform-aws-security-group/blob/master/main.tf#L358
  # https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group#ingress
  ingress_with_self = [
    {
      from_port   = 587
      to_port     = 587
      protocol    = "tcp"
      description = "SES SMTP interface"
    },
    {
      from_port   = 3306
      to_port     = 3306
      protocol    = "tcp"
      description = "Main database"
    },
  ]
  # Terraform removes the default egress rule, so it needs to be recreated
  # https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group#basic-usage
  egress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = "0.0.0.0/0"
      description = "Default rule"
    }
  ]
}

################################################################################
# VPC Endpoint
################################################################################
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_endpoint

resource "aws_vpc_endpoint" "ses" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.us-east-1.email-smtp"
  vpc_endpoint_type = "Interface"

  security_group_ids  = [module.vote_service_sg.security_group_id]
  subnet_ids          = [module.vpc.private_subnets[0]]
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id          = module.vpc.vpc_id
  service_name    = "com.amazonaws.us-east-1.dynamodb"
  route_table_ids = [module.vpc.vpc_main_route_table_id]
}
