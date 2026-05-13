resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api"
  role          = aws_iam_role.lambda.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.app.repository_url}:${var.image_tag}"

  timeout     = var.lambda_timeout_seconds
  memory_size = var.lambda_memory_mb

  environment {
    variables = {
      NODE_ENV                            = "production"
      QR_CODES_BUCKET_NAME                = aws_s3_bucket.qr_codes.bucket
      QR_CODES_TABLE_NAME                 = aws_dynamodb_table.qr_metadata.name
      QR_CODES_PUBLIC_BASE_URL            = "https://${aws_s3_bucket.qr_codes.bucket}.s3.${var.aws_region}.amazonaws.com"
      QR_CODE_EXPIRATION_DAYS             = tostring(var.qr_code_expiration_days)
      QR_CODE_MAX_URL_LENGTH              = "2048"
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_data,
  ]

  lifecycle {
    precondition {
      condition     = length(var.image_tag) > 0
      error_message = "image_tag cannot be empty."
    }
  }
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

