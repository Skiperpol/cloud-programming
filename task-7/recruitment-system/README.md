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
cd task-7/recruitment-system   # .env musi być w tym katalogu (Compose podstawia ${VAR})
npm run stack:deploy
```

### HTTP do każdego mikroserwisu (z laptopa)

Po deploy wszystkie serwisy mają Swagger i REST na **localhost**:

| Serwis | Port | Swagger | Przykładowe API |
|--------|------|---------|-----------------|
| gateway | 3000 | http://localhost:3000/docs | `POST /recruitment/apply` |
| candidate | 3001 | http://localhost:3001/docs | `GET /candidates` |
| parsing | 3002 | http://localhost:3002/docs | `GET /parser/...` |
| verification | 3003 | http://localhost:3003/docs | `GET /verification/...` |
| qualification | 3004 | http://localhost:3004/docs | `GET /qualification/...` |
| notification | 3005 | http://localhost:3005/docs | `GET /notifications` |

Health na każdym: `curl http://localhost:300X/health`

**Uwaga:** pełny flow rekrutacji (`/apply`) i tak startuje w **gateway** i idzie dalej przez **RabbitMQ** — wołanie candidate/parsing bez wcześniejszego eventu pokaże tylko ich własne dane (np. listy), nie „cały proces”.

### Swarm wolno odpowiada?

| Przyczyna | Co zrobić |
|-----------|-----------|
| Ingress mesh (gateway, candidate, parsing) | Na 1 PC wolniejsze — normalne; verification/qualification/notification mają `mode: host` (szybsze przy 1 replice) |
| Wiele replik + `mode: host` | Na jednym węźle tylko 1 replika może trzymać port — przy scale używaj ingress |
| Demo skalowania | `docker service scale recruitment_system_parsing-service=6` — HTTP przez ingress, może mulić |
| `/apply` muli | S3 + RDS + RabbitMQ — logi gateway |
| Repliki `0/N` | `docker service ps … --no-trunc` |

Po zmianie compose:

```bash
docker stack rm recruitment_system
# poczekaj aż zniknie: docker stack ls
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


### Komendy do dockera
docker swarm init
docker stack deploy -c docker-compose.yml recruitment_system
docker service ls
docker service ps recruitment_system_gateway-service
docker service scale recruitment_system_gateway-service=5
docker stack rm recruitment_system


export $(envsubst < .env | grep -v '^#' | xargs) && docker stack deploy -c docker-compose.yml recruitment_system


cd task-7/recruitment-system/terraform/stage-1-infra

terraform init -reconfigure \
  -backend-config="bucket=TU_WKLEJ_NAZWE_BUCKETA" \
  -backend-config="key=task-7/recruitment-system/stage-1-infra/terraform.tfstate" \
  -backend-config="region=${AWS_REGION}" \
  -backend-config="encrypt=true" \
  -backend-config="use_lockfile=true"

terraform output -json database_urls