output "database_urls" {
  value = {
    for name in local.db_names :
    name => "postgres://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${name}"
  }
  description = "Map of connection URLs for all service databases."
  sensitive   = true
}

output "qualification_redis_url" {
  value       = var.create_redis_replication_group ? "redis://${aws_elasticache_replication_group.qualification_redis[0].primary_endpoint_address}:${aws_elasticache_replication_group.qualification_redis[0].port}" : "redis://${data.aws_elasticache_replication_group.qualification_redis[0].primary_endpoint_address}:${data.aws_elasticache_replication_group.qualification_redis[0].port}"
  description = "Connection URL for qualification-service Redis join store."
}