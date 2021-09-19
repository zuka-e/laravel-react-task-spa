# https://learn.hashicorp.com/tutorials/terraform/locals?in=terraform/configuration-language

terraform {
  # `remote` stores state and may be used to run operations in Terraform Cloud
  backend "remote" {
    # https://www.terraform.io/docs/language/settings/backends/remote.html#using-cli-input
  }
}

# https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
provider "aws" {
  profile = local.profile
  region  = local.region
}

locals {
  profile = var.aws_profile
  region  = var.aws_region
}
