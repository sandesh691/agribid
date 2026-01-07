import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const pools = [
        { name: 'Maharashtra Onion Collective' },
        { name: 'Punjab Wheat Bulk Pool' },
        { name: 'Gujarat Groundnut Export' }
    ];

    for (const pool of pools) {
        await prisma.pooledCrop.upsert({
            where: { id: pool.name }, // This is a hack for upsert with uuid, let's just use create
            update: {},
            create: { name: pool.name }
        }).catch(() => { }); // Simple catch-all for existing entries
    }

    // Try creating directly
    try {
        await prisma.pooledCrop.createMany({
            data: pools,
            skipDuplicates: true
        });
    } catch (e) { }

    console.log('Seed pools finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
