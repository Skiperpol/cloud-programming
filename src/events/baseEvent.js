export class BaseEvent {
    constructor(payload = {}) {
        this.metadata = {
        timestamp: new Date().toISOString(),
        type: this.constructor.name
        };
        this.payload = payload;
    }

    serialize() {
        return Buffer.from(JSON.stringify(this));
    }
}
  