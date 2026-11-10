import { Module } from '@nestjs/common';
import { DATABASE_PORT } from '../core/application/ports/database.port';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: DATABASE_PORT,
      useExisting: PrismaService,
    },
  ],
  exports: [PrismaService, DATABASE_PORT],
})
export class PrismaModule {}
