variable "aws_region" {
  type        = string
  description = "AWS region for backend resources"
}

variable "state_bucket_name" {
  type        = string
  description = "S3 bucket name for Terraform state"
}
