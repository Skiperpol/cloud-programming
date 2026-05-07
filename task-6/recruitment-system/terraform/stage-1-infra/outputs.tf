output "gateway_db_url" {
  value       = "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/gateway_db"
  description = "Connection URL for gateway-service database."
  sensitive   = true
}

output "candidate_db_url" {
  value       = "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/candidate_db"
  description = "Connection URL for candidate-service database."
  sensitive   = true
}

output "parser_db_url" {
  value       = "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/parser_db"
  description = "Connection URL for parsing-service database."
  sensitive   = true
}

output "blacklist_db_url" {
  value       = "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/blacklist_db"
  description = "Connection URL for verification-service database."
  sensitive   = true
}

output "qualification_db_url" {
  value       = "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/qualification_db"
  description = "Connection URL for qualification-service database."
  sensitive   = true
}

output "notification_db_url" {
  value       = "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/notification_db"
  description = "Connection URL for notification-service database."
  sensitive   = true
}

output "qualification_redis_url" {
  value       = "redis://${aws_elasticache_replication_group.qualification_redis.primary_endpoint_address}:${aws_elasticache_replication_group.qualification_redis.port}"
  description = "Connection URL for qualification-service Redis join store."
}

output "dostepne_subnety" { value = data.aws_subnets.default.ids }