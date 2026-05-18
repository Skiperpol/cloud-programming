data "terraform_remote_state" "stage1_local" {
  count   = var.use_stage1_state && var.stage1_state_backend == "local" ? 1 : 0
  backend = "local"

  config = {
    path = var.stage1_state_path
  }
}

data "terraform_remote_state" "stage1_s3" {
  count   = var.use_stage1_state && var.stage1_state_backend == "s3" ? 1 : 0
  backend = "s3"

  config = {
    bucket = var.stage1_state_bucket
    key    = var.stage1_state_key
    region = var.stage1_state_region
  }
}
