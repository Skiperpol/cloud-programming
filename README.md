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

### Architektura i pliki

- **`main.js`**  
  Główne wejście aplikacji:
  - tworzy połączenie z RabbitMQ,
  - konfiguruje workflow publisherów i consumerów,
  - uruchamia relay (odbiór `Typ3Event` → publikacja `Typ4Event`),
  - czeka na wszystkie zadania (`Promise.all`).

- **`amqpBase.js`**  
  Klasa bazowa `AmqpService`:
  - przechowuje `connection`, `logger` i `channel`,
  - metoda `init()` tworzy kanał (`createChannel()`).

- **`events.js`**  
  Definicje zdarzeń:
  - `BaseEvent` (wspólna logika: `metadata` z czasem i nazwą typu, `payload`, metoda `serialize()` zwracająca `Buffer` JSON),
  - `Typ1Event`, `Typ2Event`, `Typ3Event`, `Typ4Event` (dziedziczą po `BaseEvent`),
  - pomocnicza funkcja `getRoutingKey`.

- **`publisher.js`**  
  Klasa `EventPublisher` (dziedziczy po `AmqpService`):
  - `publish(EventType)` – tworzy instancję zdarzenia, wyznacza `routingKey` na podstawie typu, wysyła wiadomość do kolejki,
  - `startPublisher(EventType, interval, isRandom)` – cyklicznie (lub w losowych odstępach) publikuje zdarzenia danego typu.

- **`consumer.js`**  
  Klasa `EventConsumer` (dziedziczy po `AmqpService`):
  - `consume(EventType, onMessage?)` – nasłuchuje na kolejce o nazwie `EventType.name`,
    - loguje odebranie wiadomości,
    - opcjonalnie wywołuje przekazaną funkcję `onMessage(data, channel)`,
    - potwierdza wiadomość (`ack`).

- **`logger.js`**  
  Konfiguracja logowania z użyciem `winston`:
  - format z czasem, etykietą (`label`) i poziomem logowania,
  - transporty:
    - do pliku `all.log`,
    - na konsolę.


---

### Logowanie

Wszystkie serwisy (publisherzy, consumerzy, main, relay) tworzą własne loggery za pomocą:

```js
import { createLogger } from './logger.js';
```

Logi trafiają do:

- pliku `all.log` (w katalogu projektu),
- standardowego wyjścia (konsola).

Przykładowy format:

```text
2026-03-17 12:34:56 [Pub-Typ1Event-1] info: Wysłano: Typ1Event
```

---

### Rozszerzanie projektu

Możesz łatwo dodać nowe typy zdarzeń lub logikę:

- **Nowy typ zdarzenia**  
  Dodaj nową klasę w `events.js` dziedziczącą z `BaseEvent`, np. `Typ5Event`.
- **Nowy publisher / consumer**  
  Zmodyfikuj obiekt `workflow` w `main.js`, dodając:
  - wpis w `publishers` (typ, liczba instancji, interwał),
  - wpis w `consumers` (typ, liczba instancji, opcjonalna logika w `consume` z callbackiem).

---