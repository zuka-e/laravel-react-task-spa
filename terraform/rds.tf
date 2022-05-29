locals {
  identifier           = "${lower(var.project)}-${var.stage}"
  engine               = "mariadb"
  major_engine_version = "10.4"
  name                 = "${lower(var.project)}_${var.stage}"
  username             = var.db_username
}

# https://github.com/terraform-aws-modules/terraform-aws-rds
module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = local.identifier

  engine         = local.engine
  engine_version = local.major_engine_version
  instance_class = "db.t3.micro"

  storage_type          = "gp2" # General purpose SSD
  allocated_storage     = 20    # 20 GiB
  max_allocated_storage = 0     # Disable autoscaling

  db_name                = local.name
  username               = local.username
  create_random_password = true
  port                   = "3306"

  create_db_subnet_group = true
  subnet_ids             = module.vpc.database_subnets
  vpc_security_group_ids = [module.security_group.security_group_id]

  # Parameter group
  family = "${local.engine}${local.major_engine_version}"
  # DB option group
  major_engine_version = local.major_engine_version

  maintenance_window      = "Sat:15:00-Sat:18:00"
  backup_window           = "18:00-21:00" # Don't overlap with maintenance_window
  backup_retention_period = 7             # Enable backup and retain for X days
  skip_final_snapshot     = true          # Not create a snapshot when DB is deleted

  # Enhanced monitoring
  create_monitoring_role = true
  monitoring_role_name   = "${local.identifier}-rds-monitoring-role"
  monitoring_interval    = 60

  # Log
  enabled_cloudwatch_logs_exports = ["audit", "error", "general", "slowquery"]

  # Performance Insights not supported for this configuration (db.t3.micro).
  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.Overview.Engines.html
  # performance_insights_enabled          = true
  # performance_insights_retention_period = 7

  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.MariaDB.Parameters.html
  parameters = [
    {
      name  = "character_set_client"
      value = "utf8mb4"
    },
    {
      name  = "character_set_server"
      value = "utf8mb4"
    }
  ]

  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.MariaDB.Options.html
  options = [
    {
      option_name = "MARIADB_AUDIT_PLUGIN"
    },
  ]
}
