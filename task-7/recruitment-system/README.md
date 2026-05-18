# Recruitment CV-Flow (Task 6)

Deployment mikroserwisów z użyciem Docker images (z task-5) i Terraform w 2 etapach.

## Etap 1 - infrastruktura danych (`terraform/stage-1-infra`)

Tworzy:
- 1 instancję Amazon RDS PostgreSQL,
- 6 baz logicznych w tej jednej instancji (`gateway_db`, `candidate_db`, `parser_db`, `blacklist_db`, `qualification_db`, `notification_db`),
- Redis (Amazon ElastiCache) dla `qualification-service`,
- security groups i subnet groups.

Pliki:
- `terraform/stage-1-infra/main.tf`
- `terraform/stage-1-infra/variables.tf`
- `terraform/stage-1-infra/outputs.tf`

Uruchomienie:

```bash
cd terraform/stage-1-infra
terraform init
terraform apply
```

Wynik (outputs) zawiera URL-e DB i Redis do wykorzystania w etapie 2.

## Etap 2 - deployment aplikacji (`terraform/stage-2-app`)

Tworzy:
- ECS Cluster (Fargate),
- IAM roles dla tasków,
- CloudWatch Log Group,
- ECS Task Definitions i ECS Services dla:
  - `gateway`
  - `candidate`
  - `parsing`
  - `verification`
  - `qualification`
  - `notification`

Domyślnie etap 2 czyta URL-e DB/Redis z `terraform.tfstate` etapu 1.
Można to wyłączyć (`use_stage1_state = false`) i podać zewnętrzne URL-e ręcznie.

Pliki:
- `terraform/stage-2-app/main.tf`
- `terraform/stage-2-app/variables.tf`
- `terraform/stage-2-app/outputs.tf`

## Wymaganie: obrazy Docker

Przed `terraform apply` w etapie 2 obrazy muszą być dostępne z AWS ECS
(najczęściej w ECR). Uzupełnij mapę `images` URI-ami obrazów.

Przykład `terraform/stage-2-app/terraform.tfvars`:

```hcl
aws_region    = "eu-north-1"
project_name  = "recruitment-system"
rabbitmq_url  = "amqps://<user>:<password>@<host>/<vhost>"
aws_s3_bucket = "your-bucket-name"

images = {
  gateway       = "123456789012.dkr.ecr.eu-north-1.amazonaws.com/gateway-service:latest"
  candidate     = "123456789012.dkr.ecr.eu-north-1.amazonaws.com/candidate-service:latest"
  parsing       = "123456789012.dkr.ecr.eu-north-1.amazonaws.com/parsing-service:latest"
  verification  = "123456789012.dkr.ecr.eu-north-1.amazonaws.com/verification-service:latest"
  qualification = "123456789012.dkr.ecr.eu-north-1.amazonaws.com/qualification-service:latest"
  notification  = "123456789012.dkr.ecr.eu-north-1.amazonaws.com/notification-service:latest"
}
```

Uruchomienie:

```bash
cd terraform/stage-2-app
terraform init
terraform apply
```

## Uwaga o RabbitMQ i AWS / Azure

RabbitMQ nie jest tworzony przez Terraform (jest usługą zewnętrzną). Podajesz go przez `rabbitmq_url` w etapie 2.

## Uwaga o AWS / Azure

Aktualna implementacja Terraform jest gotowa pod AWS.
Jeśli DB/Redis są już poza AWS (lub poza Terraform), pomiń etap 1 i w etapie 2 ustaw:
- `use_stage1_state = false`
- ręcznie URL-e: `gateway_db_url`, `candidate_db_url`, `parser_db_url`,
  `blacklist_db_url`, `qualification_db_url`, `notification_db_url`,
  `qualification_redis_url`.
