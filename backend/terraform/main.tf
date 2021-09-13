# https://learn.hashicorp.com/tutorials/terraform/locals?in=terraform/configuration-language

# https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
provider "aws" {
  profile = local.profile
  region  = local.region
}

locals {
  profile = var.aws_profile
  region  = var.aws_region
}
