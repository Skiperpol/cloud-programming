resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "qr_codes" {
  bucket        = "${var.project_name}-qr-${random_id.bucket_suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "qr_codes_public_read" {
  bucket = aws_s3_bucket.qr_codes.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.qr_codes.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.qr_codes]
}
