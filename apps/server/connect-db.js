const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log('Database connected');
    return prisma.$disconnect();
  })
  .catch(err => {
    console.error(err);
  });