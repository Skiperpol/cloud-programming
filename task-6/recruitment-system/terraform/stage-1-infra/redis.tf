resource "aws_elasticache_parameter_group" "redis7" {
  name   = "${var.project_name}-redis7-params"
  family = "redis7"
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-redis-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_elasticache_replication_group" "qualification_redis" {
  replication_group_id = "${var.project_name}-redis"
  description          = "Redis for qualification service"

  # Wydajność i koszty
  node_type          = var.redis_node_type
  num_cache_clusters = 1

  # Silnik i konfiguracja
  engine               = "redis"
  engine_version       = "7.1"
  port                 = 6379
  parameter_group_name = aws_elasticache_parameter_group.redis7.name
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]

  # Oszczędności i wygoda na studia
  at_rest_encryption_enabled = false
  transit_encryption_enabled = false
  apply_immediately          = true
  snapshot_retention_limit   = 0
}