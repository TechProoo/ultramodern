import { Prisma, PrismaClient } from '@prisma/client';
import { SEED_EQUIPMENT, SEED_PARTS, SEED_TICKETS, SEED_USERS } from '../src/data/seed';

// Idempotent seed: skipDuplicates means re-running never clobbers live data.
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({ data: SEED_USERS, skipDuplicates: true });

  await prisma.equipment.createMany({
    data: SEED_EQUIPMENT.map((e) => ({
      ...e,
      specs: e.specs as unknown as Prisma.InputJsonValue,
      history: e.history as unknown as Prisma.InputJsonValue,
    })),
    skipDuplicates: true,
  });

  await prisma.part.createMany({ data: SEED_PARTS, skipDuplicates: true });
  // Tickets display newest-first (seq desc), so insert oldest-first to keep
  // the seed array's display order.
  await prisma.ticket.createMany({ data: [...SEED_TICKETS].reverse(), skipDuplicates: true });

  const [users, equipment, parts, tickets] = await Promise.all([
    prisma.user.count(),
    prisma.equipment.count(),
    prisma.part.count(),
    prisma.ticket.count(),
  ]);
  console.log(`Seeded — users: ${users}, equipment: ${equipment}, parts: ${parts}, tickets: ${tickets}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
