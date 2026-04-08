# Recruitment CV-Flow (Task 2)

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
