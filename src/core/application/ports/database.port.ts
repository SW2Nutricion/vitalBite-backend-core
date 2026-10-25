import type { PrismaClient } from '../../../prisma/generated-client';

/**
 * Port used by application services to access persistence.
 *
 * The concrete Prisma adapter is registered by the infrastructure module.
 * Keeping the injection token here prevents application services from
 * depending on Nest's Prisma adapter directly.
 */
export const DATABASE_PORT = Symbol('DATABASE_PORT');

export type DatabasePort = PrismaClient;
