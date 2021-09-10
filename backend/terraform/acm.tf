# Certificates issue and validation using Route53 (record)
# https://github.com/terraform-aws-modules/terraform-aws-acm
module "acm" {
  source = "terraform-aws-modules/acm/aws"

  domain_name = "*.${data.aws_route53_zone.root.name}"
  zone_id     = data.aws_route53_zone.root.zone_id

  wait_for_validation = true

  depends_on = [
    data.aws_route53_zone.root
  ]
}
