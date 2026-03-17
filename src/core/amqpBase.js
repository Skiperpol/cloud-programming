export class AmqpService {
    constructor(connection, logger) {
      this.connection = connection;
      this.logger = logger;
      this.channel = null;
    }
  
    async init() {
      this.channel = await this.connection.createChannel();
      return this;
    }
  }