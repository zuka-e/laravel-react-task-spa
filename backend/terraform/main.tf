# https://learn.hashicorp.com/tutorials/terraform/locals?in=terraform/configuration-language

provider "aws" {
  profile = "default"
  region  = local.region
}

locals {
  region = var.aws_region
}
