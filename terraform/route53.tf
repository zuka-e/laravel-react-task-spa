locals {
  root_domain = var.root_domain
}

################################################################################
# Hosted Zone (Read only)
################################################################################
# https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/migrate-dns-domain-in-use.html
# https://www.terraform.io/docs/language/data-sources/index.html
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone

data "aws_route53_zone" "root" {
  name = local.root_domain.name
}

################################################################################
# DNS records
################################################################################
# https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html#rrsets-values-basic-ttl
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record

resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = data.aws_route53_zone.root.name
  type    = "A"
  ttl     = "300"
  records = local.root_domain.records.a
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = "www.${data.aws_route53_zone.root.name}"
  type    = "CNAME"
  ttl     = "300"
  records = local.root_domain.records.cname
}
