import { AmqpService } from './amqpBase.js';

export class EventConsumer extends AmqpService {
  async consume(EventType, onMessage) {
    const queue = EventType.name;
    await this.channel.assertQueue(queue);

    this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      
      const data = JSON.parse(msg.content.toString());
      this.logger.info(`Odebrano: ${queue}`);

      try {
        if (onMessage) await onMessage(data, this.channel);
        this.channel.ack(msg);
      } catch (err) {
        this.logger.error(`Błąd przetwarzania: ${err.message}`);
      }
    });
  }
}