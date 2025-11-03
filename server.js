// Lightweight bootstrap to run Next.js standalone build on shared panels (cPanel/Plesk)
// It simply loads the compiled server from .next/standalone and forwards env/port.

process.env.PORT = process.env.PORT || 3000;
process.env.HOST = process.env.HOST || '0.0.0.0';

// Prisma engines sometimes need a writable tmp
process.env.PRISMA_CLIENT_ENGINE_TYPE = process.env.PRISMA_CLIENT_ENGINE_TYPE || 'binary';

// Start the compiled Next server
require('./.next/standalone/server.js');
