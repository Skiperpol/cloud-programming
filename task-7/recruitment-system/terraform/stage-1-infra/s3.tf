data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "application_uploads" {
  bucket        = "${var.project_name}-uploads-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "application_uploads" {
  bucket = aws_s3_bucket.application_uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "application_uploads" {
  bucket = aws_s3_bucket.application_uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
