resource "aws_elasticache_parameter_group" "redis7" {
  count  = var.create_subnet_and_param_groups ? 1 : 0
  name   = "${var.project_name}-redis7-params"
  family = "redis7"
}

resource "aws_security_group" "redis" {
  name_prefix = "${var.project_name}-redis-"
  description = "Allow Redis access for qualification service"
  vpc_id      = data.aws_vpc.default.id

  tags = {
    Name = "${var.project_name}-redis-sg"
  }
}

resource "aws_security_group_rule" "redis_ingress" {
  type              = "ingress"
  from_port         = 6379
  to_port           = 6379
  protocol          = "tcp"
  cidr_blocks       = var.redis_allowed_cidrs
  security_group_id = aws_security_group.redis.id
}

resource "aws_security_group_rule" "redis_all_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.redis.id
}

resource "aws_elasticache_subnet_group" "main" {
  count      = var.create_subnet_and_param_groups ? 1 : 0
  name       = "${var.project_name}-redis-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

data "aws_elasticache_subnet_group" "main" {
  count = var.create_subnet_and_param_groups ? 0 : 1
  name  = "${var.project_name}-redis-subnets"
}

resource "aws_elasticache_replication_group" "qualification_redis" {
  count                = var.create_redis_replication_group ? 1 : 0
  replication_group_id = "${var.project_name}-redis"
  description          = "Redis for qualification service"

  node_type          = var.redis_node_type
  num_cache_clusters = 1

  engine               = "redis"
  engine_version       = "7.1"
  port                 = 6379
  parameter_group_name = var.create_subnet_and_param_groups ? aws_elasticache_parameter_group.redis7[0].name : "${var.project_name}-redis7-params"
  subnet_group_name    = var.create_subnet_and_param_groups ? aws_elasticache_subnet_group.main[0].name : data.aws_elasticache_subnet_group.main[0].name
  security_group_ids   = [aws_security_group.redis.id]

  at_rest_encryption_enabled = false
  transit_encryption_enabled = false
  apply_immediately          = true
  snapshot_retention_limit   = 0

  lifecycle {
    ignore_changes = [auth_token, transit_encryption_enabled]
  }
}

data "aws_elasticache_replication_group" "qualification_redis" {
  count                = var.create_redis_replication_group ? 0 : 1
  replication_group_id = "${var.project_name}-redis"
}