require('dotenv').config();
const { sequelize, Contact } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced with force: true');

    const contacts = await Contact.bulkCreate([
      {
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah.connor@cyberdyne.com',
        phoneNumber: '+1-555-8392',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'USA',
        companyName: 'Cyberdyne Systems',
        jobTitle: 'Senior Security Architect',
        department: 'Cybersecurity',
        category: 'Professional',
        isFavorite: true,
        notes: 'Lead on system resilience and vulnerability assessment.'
      },
      {
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony@starkindustries.com',
        phoneNumber: '+1-555-3000',
        street: '10880 Malibu Point',
        city: 'Malibu',
        state: 'CA',
        postalCode: '90265',
        country: 'USA',
        companyName: 'Stark Industries',
        jobTitle: 'Chief Executive Officer',
        department: 'Executive',
        category: 'Professional',
        isFavorite: true,
        notes: 'Key investor and hardware collaborator.'
      },
      {
        firstName: 'Peter',
        lastName: 'Parker',
        email: 'peter.parker@dailybugle.com',
        phoneNumber: '+1-555-0199',
        street: '20 Ingram Street',
        city: 'Queens',
        state: 'NY',
        postalCode: '11375',
        country: 'USA',
        companyName: 'Daily Bugle',
        jobTitle: 'Freelance Photojournalist',
        department: 'Editorial',
        category: 'Personal',
        isFavorite: false,
        notes: 'University research assistant in biophysics.'
      },
      {
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce@wayneenterprises.com',
        phoneNumber: '+1-555-9000',
        street: '1007 Mountain Drive',
        city: 'Gotham',
        state: 'NJ',
        postalCode: '07001',
        country: 'USA',
        companyName: 'Wayne Enterprises',
        jobTitle: 'Managing Partner',
        department: 'Board of Directors',
        category: 'Professional',
        isFavorite: false,
        notes: 'Philanthropic partnerships coordinator.'
      },
      {
        firstName: 'Mary',
        lastName: 'Watson',
        email: 'mary.watson@broadwayarts.org',
        phoneNumber: '+1-555-4421',
        street: '450 West 42nd St',
        city: 'New York',
        state: 'NY',
        postalCode: '10036',
        country: 'USA',
        companyName: 'Broadway Arts',
        jobTitle: 'Creative Director',
        department: 'Production',
        category: 'Personal',
        isFavorite: true,
        notes: 'Close friend from college.'
      }
    ]);

    console.log(`✓ Seeded ${contacts.length} contacts successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
