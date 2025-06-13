import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedHauntedLocations() {
    const hauntedLocations = [
        {
            name: 'Phantom Beacon Lighthouse',
            description: 'A 19th century lighthouse where phantom keepers are said to still maintain the light. Visitors report hearing footsteps on the spiral staircase at night.',
            street: '321 Rocky Point Road',
            city: 'New Harbor',
            state: 'ME',
            country: 'USA',
        },
        {
            name: 'Misty Point Lighthouse',
            description: 'Built in 1843, this lighthouse has claimed the lives of multiple keepers. On foggy nights, visitors claim to hear the desperate ringing of a warning bell that no longer exists.',
            street: '789 Cliffside Path',
            city: 'Foggy Harbor',
            state: 'OR',
            country: 'USA',
        },
        {
            name: 'Hotel Netherworld',
            description: 'A luxurious hotel from the 1920s with a dark past. The fifth floor is rumored to be particularly active, with guests reporting cold spots and glimpses of a woman in period clothing.',
            street: '1313 Haunted Avenue',
            city: 'Salem',
            state: 'MA',
            country: 'USA',
        },
        {
            name: 'The Crimson Palace',
            description: 'Once a palatial mansion belonging to an eccentric millionaire, now a boutique hotel where guests report vivid nightmares and seeing the same mysterious figure in their dreams.',
            street: '666 Overlook Drive',
            city: 'Silent Falls',
            state: 'CO',
            country: 'USA',
        },
        {
            name: 'Whispering Pines Cabin',
            description: 'Deep in the woods, this remote cabin is known for the strange whispers heard in the surrounding pines. Previous guests report objects moving on their own.',
            street: 'Forest Service Road 7',
            city: 'Pine Hollow', 
            state: 'OR',
            country: 'USA',
        },
        {
            name: 'Moonlit Hollow Lodge',
            description: 'This seemingly cozy cabin sits on the site of a forgotten 19th century sanitarium. Guests report hearing children laughing at night, despite being miles from civilization.',
            street: '13 Hollow Road',
            city: 'Blackwood',
            state: 'WV',
            country: 'USA',
        },
        {
            name: 'Sasquatch Sanctuary Campground',
            description: 'Located in the heart of bigfoot country, this campground has reported more sasquatch sightings than any other location in America. Strange howls echo through the valley at night.',
            street: 'Old Forest Highway',
            city: 'Willow Creek',
            state: 'CA',
            country: 'USA',
        },
        {
            name: 'Jersey Devil Retreat',
            description: 'This historic lodge on the edge of the Pine Barrens offers guided tours to search for the legendary Jersey Devil. The proprietor has a collection of alleged evidence including footprints.',
            street: '13 Pines Road',
            city: 'Leeds Point',
            state: 'NJ',
            country: 'USA',
        },
        {
            name: 'Blackrock Asylum',
            description: 'Once a notorious mental institution with a dark history of experimental treatments, now partially restored as a museum. The upper floors remain unnaturally cold, and cameras frequently malfunction.',
            street: '1428 Asylum Ridge Road',
            city: 'Ravencrest',
            state: 'NY',
            country: 'USA',
        },
        {
            name: 'Thornwood Manor',
            description: 'This sprawling plantation house has a reputation for being unable to keep caretakers. The master bedroom is said to be the most active area, with reports of a ghostly woman searching for something.',
            street: '300 Heritage Lane',
            city: 'Thornwood',
            state: 'LA',
            country: 'USA',
        },
        {
            name: 'Mothman Motel',
            description: 'This unassuming roadside motel sits near the infamous Silver Bridge collapse site. Guests claim to see red eyes peering through their windows and experience prophetic dreams.',
            street: '1967 Bridge Street',
            city: 'Point Pleasant',
            state: 'WV',
            country: 'USA',
        },
        {
            name: 'Witch\'s Cottage',
            description: 'A restored colonial-era cottage once owned by a woman accused during the witch trials. The garden still grows unusually well, and electronics tend to malfunction during full moons.',
            street: '17 Gallows Lane',
            city: 'Salem',
            state: 'MA',
            country: 'USA',
        },
        {
            name: 'Overlook Hotel',
            description: 'An isolated mountain resort that closes during the harsh winter months. Previous winter caretakers have reported bizarre hallucinations and violent impulses while snowed in.',
            street: '217 Mountain Pass Road',
            city: 'Sidewinder',
            state: 'CO',
            country: 'USA',
        },
        {
            name: 'Skinwalker Ranch Cabins',
            description: 'Luxury cabins on the edge of infamous ranch known for bizarre paranormal phenomena. Guests report seeing impossible creatures and experiencing missing time.',
            street: 'Skinwalker Ridge Road',
            city: 'Ballard',
            state: 'UT',
            country: 'USA',
        }
    ];

    try {
        console.log('🧟‍♂️ Adding 14 spooky locations...');
        
        for (const location of hauntedLocations) {
            const created = await prisma.location.create({
                data: location
            });
            console.log(`Created: ${created.name} (${created.city}, ${created.state})`);
        }
        
        console.log('✅ All locations added successfully!');
    } catch (e) {
        console.error('💀 Error creating haunted locations:', e);
    } finally {
        await prisma.$disconnect();
    }
}

seedHauntedLocations(); 