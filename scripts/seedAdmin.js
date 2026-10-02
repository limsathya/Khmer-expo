const path = require('path');

const backendRoot = path.resolve(__dirname, '..', 'backend/nest');
const backendNodeModules = path.join(backendRoot, 'node_modules');

try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {}

const { PrismaClient } = require(path.join(backendNodeModules, '@prisma/client'));
let bcrypt;
try {
  bcrypt = require(path.join(backendNodeModules, 'bcryptjs'));
} catch (_) {
  bcrypt = require(path.join(backendNodeModules, 'bcrypt'));
}

(async () => {
  const email       = required('SEED_ADMIN_EMAIL');
  const rawPassword = required('SEED_ADMIN_PASSWORD');
  const rounds      = Number(process.env.BCRYPT_ROUNDS ?? 10);
  if (!Number.isInteger(rounds) || rounds < 4) {
    throw new Error(`BCRYPT_ROUNDS must be an integer >= 4 (got ${process.env.BCRYPT_ROUNDS}).`);
  }

  const prisma = new PrismaClient();
  try {
    const passwordHash = await bcrypt.hash(rawPassword, rounds);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Admin user "${email}" already exists`);
    } else {
      await prisma.user.create({
        data: { email, password: passwordHash, role: 'ADMIN' },
      });
      console.log(`Admin user "${email}" created (bcrypt rounds=${rounds})`);
    }
  } finally {
    await prisma.$disconnect();
  }
})();

function required(key) {
  const v = process.env[key];
  if (!v || v.length === 0) {
    throw new Error(`${key} is required.`);
  }
  return v;
}