output "state_bucket_name" {
  description = "S3 bucket name used for Terraform state"
  value       = aws_s3_bucket.tf_state.bucket
}
