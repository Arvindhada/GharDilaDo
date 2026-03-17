const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');

// Load env vars
dotenv.config({ path: './.env' });

// Mock Data updated from your frontend
const mockPropertiesData = [
    {
        title: '2 BHK Flat in Sargasan',
        type: 'Flat',
        locality: 'Sargasan',
        city: 'Gandhinagar',
        rent: 14000,
        deposit: 42000,
        bhk: 2,
        bathrooms: 2,
        area: 950,
        floor: 3,
        totalFloors: 6,
        furnishing: 'Semi-Furnished',
        available: true,
        phone: '+91 98765 43210',
        images: ['https://images.unsplash.com/photo-1656271156496-793b972f4345', 'https://images.unsplash.com/photo-1711517479380-9fa1735be261'],
        amenities: ['Lift', 'Parking', 'Gym', 'CCTV', 'Security', 'Power Backup'],
        description: 'Well-maintained 2 BHK flat in prime Sargasan location.',
        isVerified: true,
        isFeatured: true,
        rating: 4.5,
        reviews: 12
    },
    {
        title: '3 BHK Villa in Kudasan',
        type: 'Villa',
        locality: 'Kudasan',
        city: 'Gandhinagar',
        rent: 35000,
        deposit: 105000,
        bhk: 3,
        bathrooms: 3,
        area: 2200,
        floor: 0,
        totalFloors: 2,
        furnishing: 'Furnished',
        available: true,
        phone: '+91 94263 11110',
        images: ['https://images.unsplash.com/photo-1737955658451-851e128f98a2'],
        amenities: ['Garden', 'Parking', 'AC', 'Power Backup', 'Security', 'Modular Kitchen'],
        description: 'Spacious 3 BHK villa with private garden.',
        isVerified: true,
        isFeatured: true,
        rating: 4.8,
        reviews: 8
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        // 1. Clear existing data
        await User.deleteMany();
        await Property.deleteMany();

        // 2. Create a default Broker User
        const broker = await User.create({
            name: 'Rajesh Sharma',
            email: 'rajesh@broker.com',
            password: 'password123',
            role: 'broker',
            phoneNumber: '+91 98765 43210'
        });

        console.log('Test Broker Created!');

        // 3. Map properties to this broker
        const propertiesWithOwner = mockPropertiesData.map(prop => ({
            ...prop,
            postedBy: broker._id,
            postedByRole: 'broker',
            brokerName: broker.name
        }));

        // 4. Insert Properties
        await Property.insertMany(propertiesWithOwner);
        console.log('Properties Seeded Successfully! ✅');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
