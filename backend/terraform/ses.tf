################################################################################
# Authenticating Email with DKIM
################################################################################
# https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim.html
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_domain_dkim

resource "aws_ses_domain_identity" "root" {
  domain = data.aws_route53_zone.root.name
}

resource "aws_ses_domain_dkim" "root" {
  domain = aws_ses_domain_identity.root.domain
}

resource "aws_route53_record" "root_amazonses_dkim_record" {
  count   = 3
  zone_id = data.aws_route53_zone.root.zone_id
  name    = "${element(aws_ses_domain_dkim.root.dkim_tokens, count.index)}._domainkey"
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.root.dkim_tokens, count.index)}.dkim.amazonses.com"]
}
