import { AmqpService } from './amqpBase.js';

export class EventPublisher extends AmqpService {
  async publish(EventType) {
    const event = new EventType();
    const routingKey = event.metadata.type;

    await this.channel.assertQueue(routingKey);
    this.channel.sendToQueue(routingKey, event.serialize());
    this.logger.info(`Wysłano: ${routingKey}`);
  }

  startPublisher(EventType, interval, isRandom = false) {
    const task = () => {
      this.publish(EventType);
      if (isRandom) setTimeout(task, Math.random() * 5000);
    };

    task();
    if (!isRandom) {
      setInterval(task, interval);
    }
  }
}