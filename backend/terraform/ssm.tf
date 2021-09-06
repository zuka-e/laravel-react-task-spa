# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter

################################################################################
# RDS
################################################################################
# https://github.com/terraform-aws-modules/terraform-aws-rds/blob/master/outputs.tf

resource "aws_ssm_parameter" "db_endpoint" {
  name        = "/${var.project}/${var.stage}/DB_HOST"
  type        = "SecureString"
  value       = module.db.db_instance_endpoint
  description = "The connection endpoint"
}

resource "aws_ssm_parameter" "db_name" {
  name        = "/${var.project}/${var.stage}/DB_DATABASE"
  type        = "SecureString"
  value       = module.db.db_instance_name
  description = "The database name"
}

resource "aws_ssm_parameter" "db_username" {
  name        = "/${var.project}/${var.stage}/DB_USERNAME"
  type        = "SecureString"
  value       = module.db.db_instance_username
  description = "The master username for the database"
}

resource "aws_ssm_parameter" "db_password" {
  name        = "/${var.project}/${var.stage}/DB_PASSWORD"
  type        = "SecureString"
  value       = module.db.db_master_password
  description = "The master password to connect to the database"
}
