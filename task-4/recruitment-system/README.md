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
