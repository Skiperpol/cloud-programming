# Cloud Programming - przegląd repozytorium

To repozytorium zbiera kolejne zadania projektowe z obszaru systemów rozproszonych i chmury.  
Głównym motywem jest ewolucja jednego scenariusza biznesowego (proces rekrutacyjny) od prostych integracji event-driven, przez mikroserwisy, aż po deployment i infrastrukturę w AWS.

## Co znajdziesz w repo

- `task-1` - prosty system zdarzeniowy oparty o RabbitMQ (publisherzy, consumerzy, relay, logowanie).
- `task-2/recruitment-system` - bazowa wersja mikroserwisów NestJS dla procesu rekrutacyjnego (gateway + serwisy domenowe, komunikacja eventami).
- `task-3/recruitment-system` - kolejny etap rozwoju CV-Flow (utrwalenie architektury i przepływu procesu).
- `task-4/recruitment-system` - mikroserwisy z podejściem Database per Service oraz integracją z usługami AWS (RDS, Redis, S3).
- `task-5/recruitment-system` - przygotowanie aplikacji pod konteneryzację i deployment obrazów Docker.
- `task-6/recruitment-system` - infrastruktura i wdrożenie na AWS przez Terraform (etap danych + etap aplikacji na ECS/Fargate).
- `task-7/recruitment-system` - uruchamianie systemu przez Docker Swarm + AWS (RDS/S3), wraz z automatyzacją przez workflow.
- `task-8/serverless-qr-generator` - osobny projekt serverless (NestJS + Terraform) do generowania kodów QR.

## Struktura i konwencja

- Każdy katalog `task-*` jest osobnym etapem/zakresem prac.
- Szczegółowe instrukcje uruchomienia są w lokalnych `README.md` w danym zadaniu.
- Zadania `task-2` do `task-7` dotyczą głównie jednego systemu: **Recruitment CV-Flow**.
- `task-8` to niezależny projekt, rozszerzający tematykę o podejście serverless.

## Clean Architecture w tym repo

W zadaniach związanych z `Recruitment CV-Flow` (`task-2` do `task-7`) oraz w `task-8/serverless-qr-generator` pojawia się podejście **Clean Architecture**.  
W praktyce oznacza to rozdzielenie logiki domenowej od warstwy infrastruktury i frameworka:

- logika biznesowa (use case) nie jest ściśle zależna od NestJS, bazy danych czy brokera wiadomości,
- granice między modułami/mikroserwisami są wyraźnie zdefiniowane przez kontrakty i eventy,
- łatwiej testować reguły biznesowe oraz rozwijać system bez przepisywania całej aplikacji.

Najbardziej czytelnie i konsekwentnie widać to w `task-8/serverless-qr-generator`, gdzie warstwy `domain`, `application` i `infrastructure` są wyraźnie rozdzielone, a zależności przechodzą przez porty/interfejsy i adaptery.

To podejście wspiera kolejne etapy projektu: od lokalnego uruchamiania mikroserwisów, przez konteneryzację, aż po deployment i rozwiązania serverless w chmurze.


## Cel edukacyjny

Repo pokazuje praktyczną ścieżkę:

- projektowanie komunikacji asynchronicznej,
- budowanie architektury mikroserwisowej,
- separację danych i integrację usług cloud,
- automatyzację infrastruktury i deploymentu.
