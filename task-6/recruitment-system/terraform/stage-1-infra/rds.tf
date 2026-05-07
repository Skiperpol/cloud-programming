resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-rds-"
  description = "Allow PostgreSQL access for recruitment services"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.db_allowed_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnets"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "${var.project_name}-db-subnets"
  }
}

resource "aws_db_instance" "main" {
  identifier        = "${var.project_name}-postgres"
  allocated_storage = 20
  storage_type      = "gp3"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = "db.t4g.micro" # Najtańsza

  db_name  = "postgres"
  username = var.db_master_username
  password = var.db_master_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible     = true
  skip_final_snapshot     = true
  backup_retention_period = 0
}

provider "postgresql" {
  host            = aws_db_instance.main.address
  port            = aws_db_instance.main.port
  database        = "postgres"
  username        = var.db_master_username
  password        = var.db_master_password
  sslmode         = "require"
  connect_timeout = 15
}

resource "postgresql_database" "service_db" {
  for_each = local.db_names

  name  = each.value
  owner = var.db_master_username
}