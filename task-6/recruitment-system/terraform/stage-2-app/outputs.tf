output "ecs_cluster_name" {
  value       = aws_ecs_cluster.this.name
  description = "ECS cluster name."
}

output "ecs_service_names" {
  value       = [for svc in aws_ecs_service.service : svc.name]
  description = "Deployed ECS services."
}

output "cloudwatch_log_group" {
  value       = aws_cloudwatch_log_group.ecs.name
  description = "CloudWatch log group for service logs."
}

output "application_uploads_bucket" {
  value       = aws_s3_bucket.application_uploads.bucket
  description = "S3 bucket for gateway file uploads (CVs / photos)."
}
