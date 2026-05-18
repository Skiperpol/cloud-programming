variable "aws_region" {
  type        = string
  description = "AWS region for deployment."
  default     = "eu-north-1"
}

variable "project_name" {
  type        = string
  description = "Resource name prefix."
  default     = "recruitment-system"
}

variable "use_stage1_state" {
  type        = bool
  description = "Read DB/Redis URLs from stage-1 terraform state."
  default     = true
}

variable "stage1_state_path" {
  type        = string
  description = "Path to stage-1 terraform state file."
  default     = "../stage-1-infra/terraform.tfstate"
}

variable "stage1_state_backend" {
  type        = string
  description = "Backend for stage-1 state: local or s3."
  default     = "local"
}

variable "stage1_state_bucket" {
  type        = string
  description = "S3 bucket name for stage-1 terraform state."
  default     = ""
}

variable "stage1_state_key" {
  type        = string
  description = "S3 object key for stage-1 terraform state."
  default     = "stage-1/terraform.tfstate"
}

variable "stage1_state_region" {
  type        = string
  description = "AWS region of the S3 bucket used for stage-1 state."
  default     = "eu-north-1"
}

variable "rabbitmq_url" {
  type        = string
  description = "External RabbitMQ connection URL."
}

variable "gateway_db_url" {
  type        = string
  description = "Gateway DB URL (used when stage-1 state is disabled)."
  default     = ""
}

variable "candidate_db_url" {
  type        = string
  description = "Candidate DB URL (used when stage-1 state is disabled)."
  default     = ""
}

variable "parser_db_url" {
  type        = string
  description = "Parser DB URL (used when stage-1 state is disabled)."
  default     = ""
}

variable "blacklist_db_url" {
  type        = string
  description = "Blacklist DB URL (used when stage-1 state is disabled)."
  default     = ""
}

variable "qualification_db_url" {
  type        = string
  description = "Qualification DB URL (used when stage-1 state is disabled)."
  default     = ""
}

variable "notification_db_url" {
  type        = string
  description = "Notification DB URL (used when stage-1 state is disabled)."
  default     = ""
}

variable "qualification_redis_url" {
  type        = string
  description = "Redis URL for qualification service (used when stage-1 state is disabled)."
  default     = ""
}

variable "aws_s3_force_path_style" {
  type        = string
  description = "Force path style for S3 SDK."
  default     = "false"
}

variable "s3_endpoint" {
  type        = string
  description = "Custom S3 endpoint; keep empty for AWS S3."
  default     = ""
}

variable "cpu" {
  type        = number
  description = "CPU units per ECS task."
  default     = 512
}

variable "memory" {
  type        = number
  description = "Memory in MiB per ECS task."
  default     = 1024
}

variable "desired_count" {
  type        = number
  description = "Desired number of tasks per service."
  default     = 1
}

variable "app_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access service ports."
  default     = ["0.0.0.0/0"]
}
