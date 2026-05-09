# Adopt resources that may already exist in AWS (e.g. after partial apply or fresh CI state).
# Terraform 1.5+: if the object exists, it is imported; if not, a normal create is planned.

import {
  to = aws_cloudwatch_log_group.ecs
  id = "/ecs/${var.project_name}"
}

import {
  to = aws_iam_role.execution_role
  id = "${var.project_name}-ecs-execution-role"
}

import {
  to = aws_iam_role.task_role
  id = "${var.project_name}-ecs-task-role"
}

import {
  to = aws_ecr_repository.services["gateway"]
  id = "${var.project_name}-gateway"
}

import {
  to = aws_ecr_repository.services["candidate"]
  id = "${var.project_name}-candidate"
}

import {
  to = aws_ecr_repository.services["parsing"]
  id = "${var.project_name}-parsing"
}

import {
  to = aws_ecr_repository.services["verification"]
  id = "${var.project_name}-verification"
}

import {
  to = aws_ecr_repository.services["qualification"]
  id = "${var.project_name}-qualification"
}

import {
  to = aws_ecr_repository.services["notification"]
  id = "${var.project_name}-notification"
}

import {
  to = aws_s3_bucket.application_uploads
  id = "${var.project_name}-uploads-${data.aws_caller_identity.current.account_id}"
}

import {
  to = aws_ecs_cluster.this
  id = "${var.project_name}-cluster"
}

import {
  to = aws_ecs_service.service["gateway"]
  id = "${var.project_name}-cluster/${var.project_name}-gateway"
}

import {
  to = aws_ecs_service.service["candidate"]
  id = "${var.project_name}-cluster/${var.project_name}-candidate"
}

import {
  to = aws_ecs_service.service["parsing"]
  id = "${var.project_name}-cluster/${var.project_name}-parsing"
}

import {
  to = aws_ecs_service.service["verification"]
  id = "${var.project_name}-cluster/${var.project_name}-verification"
}

import {
  to = aws_ecs_service.service["qualification"]
  id = "${var.project_name}-cluster/${var.project_name}-qualification"
}

import {
  to = aws_ecs_service.service["notification"]
  id = "${var.project_name}-cluster/${var.project_name}-notification"
}
