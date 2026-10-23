import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL database via Prisma Client...');
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL database successfully.');
    } catch (error) {
      this.logger.warn(`Initial database connection deferred: ${(error as Error).message}`);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from PostgreSQL database...');
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database.');
  }
}
