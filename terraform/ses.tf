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

################################################################################
# SMTP credentials
################################################################################
# https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_access_key

resource "aws_iam_user" "smtp" {
  name = "ses-smtp-user.${formatdate("YYYYMMDD-hhmmss", timestamp())}"
}

resource "aws_iam_access_key" "smtp" {
  user = aws_iam_user.smtp.name
}

resource "aws_iam_user_policy" "smtp" {
  name = "AmazonSesSendingAccess"
  user = aws_iam_user.smtp.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ses:SendRawEmail",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}
