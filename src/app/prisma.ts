let PrismaClient: any;
let prisma: any;

try {
  PrismaClient = require('@prisma/client').PrismaClient;
  // PrismaClient is attached to the `global` object in development to prevent
  // exhausting your database connection limit.
  //
  // Learn more: https://pris.ly/d/help/next-js-best-practices

  prisma = global.prisma || new PrismaClient();

  if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
} catch (error: any) {
  console.warn('Prisma client not available:', error?.message || 'Unknown error');
  // Create a mock prisma client for build purposes
  prisma = {
    user: { findUnique: async () => null, create: async () => null, update: async () => null },
    client: { findUnique: async () => null, create: async () => null },
    authCode: { findUnique: async () => null, create: async () => null, delete: async () => null },
    accessToken: { findUnique: async () => null, create: async () => null },
  };
}

export { prisma };

declare global {
  var prisma: any;
}
