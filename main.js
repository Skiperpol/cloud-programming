import amqp from 'amqplib';
import { createLogger } from './src/utils/logger.js';
import { EventPublisher } from './src/core/publisher.js';
import { EventConsumer } from './src/core/consumer.js';
import { Typ1Event, Typ2Event, Typ3Event, Typ4Event } from './src/events/types.js';

const workflow = {
  publishers: [
    { type: Typ1Event, count: 3, interval: 3000 },
    { type: Typ2Event, count: 1, random: true },
    { type: Typ3Event, count: 1, random: true },
  ],
  consumers: [
    { type: Typ1Event, count: 2 },
    { type: Typ2Event, count: 1 },
    { type: Typ4Event, count: 1 }
  ]
};

async function main() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const log = createLogger('Main');
  log.info('Rozpoczynam tworzenie zadań...');

  const allTasks = [];

  for (const config of workflow.publishers) {
    for (let i = 1; i <= config.count; i++) {
      const task = (async () => {
        const logger = createLogger(`Pub-${config.type.name}-${i}`);
        const publisher = new EventPublisher(connection, logger);
        await publisher.init();
        publisher.startPublisher(config.type, config.interval, config.random);
      })();
      allTasks.push(task);
    }
  }

  for (const config of workflow.consumers) {
    for (let i = 1; i <= config.count; i++) {
      const task = (async () => {
        const logger = createLogger(`Sub-${config.type.name}-${i}`);
        const consumer = new EventConsumer(connection, logger);
        await consumer.init();
        await consumer.consume(config.type);
      })();
      allTasks.push(task);
    }
  }

  allTasks.push(setupRelay(connection, log));
  log.info('Wszystkie zadania zostały utworzone.');
  log.info('Uruchamiam zadania...');
  await Promise.all(allTasks);

}

async function setupRelay(connection, log) {
  const relayLogSub = createLogger('Relay-Receiver');
  const relayLogPub = createLogger('Relay-Sender');

  const sub = new EventConsumer(connection, relayLogSub);
  const pub = new EventPublisher(connection, relayLogPub);

  await Promise.all([sub.init(), pub.init()]);

  await sub.consume(Typ3Event, async () => {
    log.info('RELAY: Przechwycono Typ 3 -> Generuję Typ 4');
    await pub.publish(Typ4Event);
  });
}

main()