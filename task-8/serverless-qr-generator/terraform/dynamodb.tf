resource "aws_dynamodb_table" "qr_metadata" {
  name         = "${var.project_name}-qr-metadata"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "fileName"

  attribute {
    name = "fileName"
    type = "S"
  }
}
