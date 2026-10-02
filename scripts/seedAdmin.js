const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  const email = 'admin@example.com';
  const passwordHash = await bcrypt.hash('password123', 10);
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('Admin user already exists');
    } else {
      await prisma.user.create({
        data: { email, password: passwordHash, role: 'ADMIN' },
      });
      console.log('Admin user created');
    }
  } finally {
    await prisma.$disconnect();
  }
})();
