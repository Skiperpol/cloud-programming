variable "aws_region" {
  type        = string
  description = "AWS region for infrastructure."
  default     = "eu-north-1"
}

variable "project_name" {
  type        = string
  description = "Resource name prefix."
  default     = "recruitment-system"
}

variable "db_master_username" {
  type        = string
  description = "Master username for PostgreSQL."
  default     = "recruitment_admin"
}

variable "db_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access PostgreSQL."
  default     = ["0.0.0.0/0"]
}

variable "redis_allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access Redis."
  default     = ["0.0.0.0/0"]
}

variable "redis_node_type" {
  type        = string
  description = "ElastiCache node type."
  default     = "cache.t4g.micro"
}
