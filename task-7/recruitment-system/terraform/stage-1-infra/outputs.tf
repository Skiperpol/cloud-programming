output "database_urls" {
  value = {
    for name in local.db_names :
    name => "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${name}"
  }
  description = "Map of connection URLs for all service databases."
  sensitive   = true
}

output "rds_endpoint" {
  value       = aws_db_instance.main.address
  description = "RDS hostname (without port)."
}

output "aws_s3_bucket" {
  value       = aws_s3_bucket.application_uploads.bucket
  description = "S3 bucket for CV uploads (gateway-service)."
}

output "aws_region" {
  value       = var.aws_region
  description = "AWS region used for infrastructure."
}
