import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addLighthouse() {
    try {
        const lighthouse = await prisma.location.create({
            data: {
                name: 'Deserted Lighthouse Inn',
                description: 'An eerie lighthouse with a dark past, now converted to a luxurious yet haunting inn.',
                street: '789 Cliffside Path',
                city: 'Foggy Harbor',
                state: 'ME',
                country: 'USA',
            }
        });
        console.log('Created new location:', lighthouse);
    } catch (e) {
        console.error('Error creating lighthouse:', e);
    } finally {
        await prisma.$disconnect();
    }
}

addLighthouse(); 