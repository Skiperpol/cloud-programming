locals {
  stage1_outputs = var.use_stage1_state ? (
    var.stage1_state_backend == "s3" ?
    data.terraform_remote_state.stage1_s3[0].outputs :
    data.terraform_remote_state.stage1_local[0].outputs
  ) : null

  gateway_db_url          = var.use_stage1_state ? local.stage1_outputs.database_urls["gateway_db"] : var.gateway_db_url
  candidate_db_url        = var.use_stage1_state ? local.stage1_outputs.database_urls["candidate_db"] : var.candidate_db_url
  parser_db_url           = var.use_stage1_state ? local.stage1_outputs.database_urls["parser_db"] : var.parser_db_url
  blacklist_db_url        = var.use_stage1_state ? local.stage1_outputs.database_urls["blacklist_db"] : var.blacklist_db_url
  qualification_db_url    = var.use_stage1_state ? local.stage1_outputs.database_urls["qualification_db"] : var.qualification_db_url
  notification_db_url     = var.use_stage1_state ? local.stage1_outputs.database_urls["notification_db"] : var.notification_db_url
  qualification_redis_url = var.use_stage1_state ? local.stage1_outputs.qualification_redis_url : var.qualification_redis_url

  services = {
    gateway = {
      port       = 3000
      db_url_env = { GATEWAY_DB_URL = local.gateway_db_url }
    }
    candidate = {
      port       = 3001
      db_url_env = { CANDIDATE_DB_URL = local.candidate_db_url }
    }
    parsing = {
      port       = 3002
      db_url_env = { PARSER_DB_URL = local.parser_db_url }
    }
    verification = {
      port       = 3003
      db_url_env = { BLACKLIST_DB_URL = local.blacklist_db_url }
    }
    qualification = {
      port = 3004
      db_url_env = {
        QUALIFICATION_DB_URL    = local.qualification_db_url
        QUALIFICATION_REDIS_URL = local.qualification_redis_url
      }
    }
    notification = {
      port       = 3005
      db_url_env = { NOTIFICATION_DB_URL = local.notification_db_url }
    }
  }

  common_env = {
    RABBITMQ_URL            = var.rabbitmq_url
    CANDIDATE_QUEUE         = "candidate.events"
    PARSER_QUEUE            = "parser.events"
    VERIFICATION_QUEUE      = "verification.events"
    QUALIFICATION_QUEUE     = "qualification.events"
    NOTIFICATION_QUEUE      = "notification.events"
    GATEWAY_QUEUE           = "gateway.events"
    AWS_REGION              = var.aws_region
    AWS_S3_BUCKET           = var.aws_s3_bucket
    AWS_S3_ENDPOINT         = var.s3_endpoint
    AWS_S3_FORCE_PATH_STYLE = var.aws_s3_force_path_style
  }
}
