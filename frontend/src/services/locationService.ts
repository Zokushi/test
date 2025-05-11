import api from './api';
import type { Location } from '../types/Location';
import scaryLighthouseImg from '../assets/scary_lightHouse_inn.jpg';
import faintingGoatInnImg from '../assets/fainting-goat-inn.jpg';
import creepyCabinImg from '../assets/creepy_cabin.jpg';

// Define the shape of the backend location data
interface BackendLocation {
    id: number;
    name: string;
    description: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    createdAt: string;
    updatedAt: string;
}

// More reliable and varied image collection
const thematicImages = {
    // Default images for different types of locations
    default: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    cabin: creepyCabinImg,
    lighthouse: scaryLighthouseImg,
    manor: 'https://images.unsplash.com/photo-1527355360241-cae3ffca384a?auto=format&fit=crop&w=600&q=80',
    mansion: 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?auto=format&fit=crop&w=600&q=80',
    inn: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    tavern: 'https://images.unsplash.com/photo-1555658636-6e4a36218be7?auto=format&fit=crop&w=600&q=80',
    theater: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=600&q=80',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    cottage: 'https://images.unsplash.com/photo-1547393947-0a09576df8c5?auto=format&fit=crop&w=600&q=80',
    library: 'https://images.unsplash.com/photo-1562932831-afcfe48b5786?auto=format&fit=crop&w=600&q=80',
    mountain: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=600&q=80',
    goat: faintingGoatInnImg,
    house: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=600&q=80',
    refinery: 'https://images.unsplash.com/photo-1518178000152-7b0efd21a45e?auto=format&fit=crop&w=600&q=80',
    motel: 'https://images.unsplash.com/photo-1545043155-f6506ba2097b?auto=format&fit=crop&w=600&q=80',

    // Specific feature images
    fireplace: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    ghost: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
    mirror: 'https://images.unsplash.com/photo-1541367774525-5f8c5694f59b?auto=format&fit=crop&w=600&q=80',
    ocean: 'https://images.unsplash.com/photo-1565109972410-1eb5e6072ba5?auto=format&fit=crop&w=600&q=80',
    victorian: 'https://images.unsplash.com/photo-1508022909583-e7d7e342a39e?auto=format&fit=crop&w=600&q=80',
    garden: 'https://images.unsplash.com/photo-1501685532562-aa6846b353e0?auto=format&fit=crop&w=600&q=80',
};

// Map specific locations to specific images
const specificLocationImages: Record<string, string> = {
    'Haunted Cabin': creepyCabinImg,
    'Deserted Lighthouse': 'https://images.unsplash.com/photo-1491331606314-1d15535360fa?auto=format&fit=crop&w=600&q=80',
    'Deserted Lighthouse Inn': scaryLighthouseImg,
    'Whispering Willows Manor': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    'The Cackling Crow Tavern': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
    'Mistfall Mountain Retreat': 'https://images.unsplash.com/photo-1518602164578-cd0074062767?auto=format&fit=crop&w=600&q=80',
    'The Crimson Curtain Theater': thematicImages.theater,
    'Fiddler\'s Green Bed & Breakfast': thematicImages.inn,
    'The Upside-Down House': thematicImages.house,
    'The Fainting Goat Inn': faintingGoatInnImg,
    'Rust Belt Refinery': thematicImages.refinery,
    'The Giggling Garden Cottage': thematicImages.cottage,
    'The Perpetual Sunset Motel': thematicImages.motel,
    'The Library of Lost Chapters': thematicImages.library,
    'The Reflectionless Retreat': thematicImages.mirror,
};

// Improved image selection function with better fallbacks
const getLocationImage = (location: BackendLocation): string => {
    try {
        // 1. Check for direct matches by name first
        if (specificLocationImages[location.name]) {
            return specificLocationImages[location.name];
        }

        const nameLower = location.name.toLowerCase();
        const descLower = location.description ? location.description.toLowerCase() : '';

        // 2. Try to match specific building types from the name
        if (nameLower.includes('lighthouse')) return thematicImages.lighthouse;
        if (nameLower.includes('cabin')) return thematicImages.cabin;
        if (nameLower.includes('manor')) return thematicImages.manor;
        if (nameLower.includes('mansion')) return thematicImages.mansion;
        if (nameLower.includes('inn')) return thematicImages.inn;
        if (nameLower.includes('tavern')) return thematicImages.tavern;
        if (nameLower.includes('theater')) return thematicImages.theater;
        if (nameLower.includes('hotel')) return thematicImages.hotel;
        if (nameLower.includes('cottage')) return thematicImages.cottage;
        if (nameLower.includes('library')) return thematicImages.library;
        if (nameLower.includes('mountain')) return thematicImages.mountain;
        if (nameLower.includes('house')) return thematicImages.house;
        if (nameLower.includes('refinery')) return thematicImages.refinery;
        if (nameLower.includes('motel')) return thematicImages.motel;
        if (nameLower.includes('goat')) return thematicImages.goat;

        // 3. Try features or themes from the description
        if (descLower.includes('mirror')) return thematicImages.mirror;
        if (descLower.includes('fireplace')) return thematicImages.fireplace;
        if (descLower.includes('garden')) return thematicImages.garden;
        if (descLower.includes('victorian')) return thematicImages.victorian;
        if (descLower.includes('ghost') || descLower.includes('spirit') || descLower.includes('haunt'))
            return thematicImages.ghost;
        if (descLower.includes('ocean') || descLower.includes('sea') || descLower.includes('coast'))
            return thematicImages.ocean;

        // 4. Fallback to default if no matches
        return thematicImages.default;
    } catch (error) {
        console.error('Error processing image for location:', location.name, error);
        return thematicImages.default;
    }
};

// Generate a compelling history based on location info
const generateHistory = (location: BackendLocation): string => {
    const hauntedHistories = [
        `Built in the late 1800s, ${location.name} has a long history of unexplained phenomena. Locals avoid the area after dark.`,
        `${location.name} was once the site of mysterious disappearances. Visitors report cold spots and whispers.`,
        `Legend says that ${location.name} is built on ancient burial grounds. Strange events have been documented since the 1920s.`,
        `Once a sanctuary for occult practices, ${location.name} now attracts paranormal investigators from across the country.`,
    ];

    // Use a safe index to prevent potential errors
    const index = location.id ? (location.id % hauntedHistories.length) : 0;
    return hauntedHistories[index];
};

// Function to convert backend location data to frontend location format
const convertToFrontendLocation = (backendLocation: BackendLocation): Location => {
    const isFeatured = backendLocation.id === 1; // Mark first location as featured

    // Create mock features based on location name and description
    const mockFeatures = [];
    const nameLower = backendLocation.name.toLowerCase();
    const descLower = backendLocation.description ? backendLocation.description.toLowerCase() : '';

    if (nameLower.includes('hotel') || nameLower.includes('inn')) mockFeatures.push('Free WiFi');
    if (descLower.includes('historic') || nameLower.includes('historic')) mockFeatures.push('Historic Building');
    if (nameLower.includes('mansion') || nameLower.includes('manor')) mockFeatures.push('Victorian Architecture');
    if (descLower.includes('ghost') || descLower.includes('haunt')) mockFeatures.push('Ghost Sightings');

    return {
        id: backendLocation.id,
        name: backendLocation.name,
        desc: backendLocation.description || 'A mysterious location with a haunted past.',
        img: getLocationImage(backendLocation),
        address: backendLocation.street || undefined,
        city: backendLocation.city || undefined,
        state: backendLocation.state || undefined,
        country: backendLocation.country || undefined,
        features: mockFeatures,
        // Generate a compelling history
        history: generateHistory(backendLocation),
        // Create mock reviews if it's the featured location
        reviews: isFeatured ? [
            {
                user: "Ghost Hunter",
                rating: 5,
                comment: "Definitely haunted! I captured EVPs and felt cold spots everywhere.",
                date: "2024-04-01"
            },
            {
                user: "Skeptical Traveler",
                rating: 4,
                comment: "Beautiful place, creepy atmosphere. Not sure if it's haunted but it was fun!",
                date: "2024-03-15"
            }
        ] : [],
        isFeatured: isFeatured,
        // Add these fields for better UX with mock data
        website: `https://www.hauntedstays.example/${backendLocation.id}`,
        contactEmail: `bookings@${backendLocation.name.toLowerCase().replace(/\s+/g, '')}.example.com`,
        // Add mock pricing (based on id to make it consistent)
        pricePerNight: `$${(backendLocation.id * 50) + 99}`,
        maxGuests: (backendLocation.id % 3) + 2
    };
};

// Get all locations
export const getLocations = async (): Promise<Location[]> => {
    try {
        const response = await api.get('/locations');
        // Convert backend data format to frontend format
        return response.data.map(convertToFrontendLocation);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

// Get a single location by ID
export const getLocationById = async (id: number): Promise<Location> => {
    try {
        const response = await api.get(`/locations/${id}`);
        return convertToFrontendLocation(response.data);
    } catch (error) {
        console.error(`Error fetching location with id ${id}:`, error);
        throw error;
    }
};