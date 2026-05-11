output "ecr_repository_url" {
  description = "ECR repository URI (without tag)"
  value       = aws_ecr_repository.app.repository_url
}

output "lambda_function_name" {
  value = aws_lambda_function.api.function_name
}

output "http_api_endpoint" {
  description = "Base API Gateway HTTP API URL (stage $default)"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "health_check_url" {
  description = "Health check GET endpoint"
  value       = "${aws_apigatewayv2_stage.default.invoke_url}health"
}

output "qr_codes_bucket_name" {
  value = aws_s3_bucket.qr_codes.bucket
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.qr_metadata.name
}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}
