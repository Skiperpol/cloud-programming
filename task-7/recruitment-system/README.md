# Recruitment CV-Flow (Task 4)

System mikroserwisowy w NestJS z podejściem Clean Architecture:

- `gateway-service`
- `candidate-service`
- `parsing-service`
- `verification-service`
- `qualification-service`
- `notification-service`

## Diagram BPMN

Poniżej osadzony diagram procesu:

![BPMN Process](images/BPMN.svg)

## Opis procesu

1. Klient wysyła aplikację przez Gateway (`POST /recruitment/apply`).
2. Gateway emituje `ApplicationSubmitted` (fan-out do Candidate, Parser, Verification, Qualification).
3. Candidate tworzy profil kandydata w swojej bazie.
4. Parser zapisuje umiejętności i publikuje `SkillsReady`.
5. Verification sprawdza blacklistę i publikuje `SafetyVerified`.
6. Qualification podejmuje decyzję (`ACCEPTED`, `REJECTED`, `BLACKLISTED`) i publikuje `DecisionMade`.
7. Notification zapisuje końcowy komunikat (`Invitation` lub `Rejection`).

## Uruchomienie

```bash
npm install
npm run start:all
```

Swagger dla każdego serwisu jest dostępny pod `http://localhost:<port>/docs`.

## AWS Database per Service

Każdy mikroserwis ma osobną bazę danych w AWS (zasada Database per service):

- `gateway-service` -> Amazon RDS for PostgreSQL (`gateway_db`)
- `candidate-service` -> Amazon RDS for PostgreSQL (`candidate_db`)
- `parsing-service` -> Amazon RDS for PostgreSQL (`parser_db`)
- `verification-service` -> Amazon RDS for PostgreSQL (`blacklist_db`)
- `qualification-service` -> Amazon RDS for PostgreSQL (`qualification_db`) + Amazon ElastiCache for Redis (join-store)
- `notification-service` -> Amazon RDS for PostgreSQL (`notification_db`)

### Uzasadnienie wyboru

- **Amazon RDS for PostgreSQL**: usługa natywna AWS, zgodna z TypeORM/SQL i spójnym modelem transakcyjnym używanym w serwisach.
- **ElastiCache Redis**: tymczasowy stan procesu kwalifikacji (TTL + lock + agregacja eventów), bardzo niskie opóźnienia.
- **S3**: pliki CV są przechowywane obiektowo, a nie w bazie relacyjnej.

## Konfiguracja połączeń DB

Parametry połączeń są pobierane z pliku konfiguracyjnego i zmiennych środowiskowych:

- konfiguracja logiczna: `libs/shared/database/database.config.ts`
- konfiguracja TypeORM + logi połączeń: `libs/shared/database/typeorm.config.ts`
- wartości środowiskowe: `.env` (wzorzec: `.env.example`)

## Logowanie połączenia z bazą

Każdy mikroserwis loguje:

1. rozpoczęcie połączenia (`Starting database connection`)
2. wynik połączenia:
   - sukces (`Database connection established`)
   - błąd (`Database connection failed`)

Na konsoli widać to **tylko dla procesów, które faktycznie uruchomiłeś** (np. `npm run start:dev` odpala wyłącznie gateway). Żeby zobaczyć logi Postgresa dla wszystkich serwisów, użyj `npm run start:all` albo osobnych terminali z `npx nest start <nazwa-serwisu> --watch`.

Dodatkowo każdy start zapisuje skrót zdarzeń do **`logs/db-connection.log`** (wspólny plik dla wszystkich procesów — wygodne przy `start:all`). `qualification-service` loguje też Redis (`qualification-service:redis` + wpisy `redis` w tym pliku).

## Task 7 — Docker Swarm + AWS RDS (bez ręcznej konfiguracji w konsoli)

### Wymagania

- Docker z obsługą Swarm
- AWS CLI + Terraform (lokalnie) **albo** GitHub Actions
- RabbitMQ osiągalny z kontenerów (np. CloudAMQP — nie `localhost` hosta)
- Sekrety GitHub: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `DB_MASTER_PASSWORD`

### 1. Infrastruktura AWS (Terraform)

**GitHub Actions (zalecane):**

1. `Task 7 - Recruitment System Bootstrap Backend` — bucket na state
2. `Task 7 - Recruitment System Infra` — RDS PostgreSQL, 6 baz danych, bucket S3 na CV

**Lokalnie:**

```bash
cd task-7/recruitment-system
export AWS_REGION=eu-central-1
export TF_VAR_db_master_password='twoje-haslo'

# Po workflow Bootstrap — init backendu (dostosuj bucket do swojego konta):
cd terraform/stage-1-infra
terraform init -reconfigure \
  -backend-config="bucket=TWÓJ-BUCKET-TFSTATE" \
  -backend-config="key=task-7/recruitment-system/stage-1-infra/terraform.tfstate" \
  -backend-config="region=${AWS_REGION}" \
  -backend-config="encrypt=true" \
  -backend-config="use_lockfile=true"
terraform apply -auto-approve
cd ../..
```

### 2. Plik `.env`

```bash
cp .env.example .env
# Uzupełnij RABBITMQ_URL oraz AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY

cd terraform/stage-1-infra
terraform output -json database_urls
terraform output -raw aws_s3_bucket
terraform output -raw aws_region
cd ../..
```

Skopiuj wartości z outputów do `.env`:

| Terraform (`database_urls`) | Zmienna w `.env` |
|-----------------------------|------------------|
| `gateway_db` | `GATEWAY_DB_URL` |
| `candidate_db` | `CANDIDATE_DB_URL` |
| `parser_db` | `PARSER_DB_URL` |
| `blacklist_db` | `BLACKLIST_DB_URL` |
| `qualification_db` | `QUALIFICATION_DB_URL` |
| `notification_db` | `NOTIFICATION_DB_URL` |

Dodatkowo: `AWS_S3_BUCKET`, `AWS_REGION` z outputów; `QUALIFICATION_REDIS_URL=redis://redis:6379`.

### 3. Build obrazów + deploy stacku

```bash
npm run docker:build
docker swarm init   # tylko przy pierwszym uruchomieniu
npm run stack:deploy
```

### 4. Operacje na stacku

```bash
npm run stack:ls
docker service ps recruitment_candidate-service
docker service scale recruitment_gateway-service=5
npm run stack:rm
```

### 5. Sprzątanie AWS

Workflow: `Task 7 - Recruitment System Destroy`

---

**Uwaga:** `qualification-service` używa Redis z stacku (`redis://redis:6379`), nie ElastiCache — wystarczy na zadanie 7.
