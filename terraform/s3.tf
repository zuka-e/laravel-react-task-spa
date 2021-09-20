# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket
resource "aws_s3_bucket" "main" {
  bucket = "${lower(var.project)}-${var.stage}"
  acl    = "private"

  versioning {
    enabled = true
  }
}
