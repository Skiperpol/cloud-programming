🇬🇧 **English version**

## Event-driven system with RabbitMQ

This project demonstrates a simple event processing system based on RabbitMQ.  
The application runs multiple **publishers** and **consumers** that handle different event types (`Typ1Event`, `Typ2Event`, `Typ3Event`, `Typ4Event`), as well as a simple **relay** that reacts to type 3 events and generates type 4 events.

Logs are written both to the console and to the `all.log` file using the `winston` library.

---

### Requirements

- **Node.js** (recommended ≥ 18.x)
- **npm**
- A running **RabbitMQ** broker (local or remote)
- Access to `amqp://` (default `amqp://localhost`)

---

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd cloud-programming
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

### Configuration

The RabbitMQ broker address is configured via the `RABBITMQ_URL` environment variable.

1. Copy the example configuration file:

   ```bash
   cp .env.example .env
   ```

2. In the `.env` file set the correct RabbitMQ URL:

   ```env
   RABBITMQ_URL=amqp://localhost
   ```

   If the variable is not set, the application will try to connect to `amqp://localhost`.

---

### Running the application

The application has no scripts defined in `package.json`, so it is run directly with Node.js:

```bash
node main.js
```

After starting:

- A connection to RabbitMQ is created.
- Based on the defined workflow, the following are started:
  - publishers for:
    - `Typ1Event` (3 instances, every 3000 ms),
    - `Typ2Event` (1 instance, random intervals),
    - `Typ3Event` (1 instance, random intervals),
  - consumers for:
    - `Typ1Event` (2 instances),
    - `Typ2Event` (1 instance),
    - `Typ4Event` (1 instance),
- A **relay** is started, which:
  - listens for `Typ3Event`,
  - after receiving a type 3 event, publishes a new type 4 event (`Typ4Event`).

Logs are written both to the **console** and to the `all.log` file.

---

🇵🇱 **Wersja polska**

## System zdarzeniowy z RabbitMQ

Ten projekt demonstruje prosty system przetwarzania zdarzeń oparty o kolejkę RabbitMQ.  
Aplikacja uruchamia wielu **publisherów** i **consumerów** obsługujących różne typy zdarzeń (`Typ1Event`, `Typ2Event`, `Typ3Event`, `Typ4Event`), a także prosty **relay**, który reaguje na zdarzenia typu 3 i generuje zdarzenia typu 4.

Logi są zapisywane zarówno w konsoli, jak i do pliku `all.log` z użyciem biblioteki `winston`.

---

### Wymagania

- **Node.js** (zalecane ≥ 18.x)
- **npm**
- Działający broker **RabbitMQ** (lokalnie lub zdalnie)
- Dostęp do `amqp://` (domyślnie `amqp://localhost`)

---

### Instalacja

1. Sklonuj repozytorium:

   ```bash
   git clone <adres_repozytorium>
   cd cloud-programming
   ```

2. Zainstaluj zależności:

   ```bash
   npm install
   ```

---

### Konfiguracja

Adres brokera RabbitMQ jest konfigurowany przez zmienną środowiskową `RABBITMQ_URL`.

1. Skopiuj plik przykładowej konfiguracji:

   ```bash
   cp .env.example .env
   ```

2. W pliku `.env` ustaw poprawny URL do RabbitMQ:

   ```env
   RABBITMQ_URL=amqp://localhost
   ```

   Jeśli zmienna nie będzie ustawiona, aplikacja spróbuje połączyć się z `amqp://localhost`.

---

### Uruchomienie aplikacji

Aplikacja nie ma zdefiniowanych skryptów w `package.json`, dlatego uruchamiana jest bezpośrednio przez Node.js:

```bash
node main.js
```

Po uruchomieniu:

- Tworzone jest połączenie z RabbitMQ.
- Na podstawie zdefiniowanego workflow startują:
  - publisherzy dla:
    - `Typ1Event` (3 instancje, cykliczne co 3000 ms),
    - `Typ2Event` (1 instancja, wysyłanie w losowych odstępach),
    - `Typ3Event` (1 instancja, wysyłanie w losowych odstępach),
  - consumerzy dla:
    - `Typ1Event` (2 instancje),
    - `Typ2Event` (1 instancja),
    - `Typ4Event` (1 instancja),
- Uruchamiany jest **relay**, który:
  - nasłuchuje na `Typ3Event`,
  - po odebraniu zdarzenia typu 3 publikuje nowe zdarzenie typu 4 (`Typ4Event`).

Logi trafią zarówno do **konsoli**, jak i do pliku `all.log`.

---