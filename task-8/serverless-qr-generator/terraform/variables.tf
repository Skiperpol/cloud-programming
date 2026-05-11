variable "aws_region" {
  type        = string
  description = "AWS region for deployed resources"
  default     = "eu-north-1"
}

variable "project_name" {
  type        = string
  description = "Resource name prefix (lowercase letters, no spaces)"
  default     = "serverless-qr"
}

variable "image_tag" {
  type        = string
  description = "ECR image tag deployed to Lambda"
  default     = "latest"
}

variable "qr_code_expiration_days" {
  type        = number
  description = "Default QR record lifetime in days (Lambda variable: QR_CODE_EXPIRATION_DAYS)"
  default     = 90
}

variable "lambda_memory_mb" {
  type        = number
  description = "Lambda function memory size (MB)"
  default     = 256
}

variable "lambda_timeout_seconds" {
  type        = number
  description = "Lambda timeout in seconds (max 900)"
  default     = 29
}
