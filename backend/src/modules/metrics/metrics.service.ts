import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: client.Registry;

  public readonly httpRequestsTotal: client.Counter;
  public readonly cupidMatchesTotal: client.Counter;
  public readonly messagesSentTotal: client.Counter;

  constructor() {
    this.registry = new client.Registry();
    this.registry.setDefaultLabels({
      app: 'match-at-sahrdaya',
    });

    client.collectDefaultMetrics({ register: this.registry });

    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests processed by NestJS API',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.cupidMatchesTotal = new client.Counter({
      name: 'cupid_matches_executed_total',
      help: 'Total matchmaking operations executed by students',
      labelNames: ['mode'],
      registers: [this.registry],
    });

    this.messagesSentTotal = new client.Counter({
      name: 'chat_messages_sent_total',
      help: 'Total student direct messages sent across campus',
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
