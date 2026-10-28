require('dotenv').config();
const { sequelize, User, Task } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced with force: true');

    // Create demo user
    const demoUser = await User.create({
      name: 'CodSoft Developer',
      email: 'demo@codsoft.dev',
      password: 'password123'
    });
    console.log(`✓ Seeded demo user: ${demoUser.email} (password: password123)`);

    // Create tasks
    const tasks = await Task.bulkCreate([
      {
        userId: demoUser.id,
        title: 'Complete Student Record Management API (Task 1)',
        description: 'Design models for Student, Course, Enrollment with validations and Swagger docs.',
        status: 'completed',
        priority: 'urgent',
        category: 'Work',
        dueDate: '2026-10-29',
        completedAt: new Date()
      },
      {
        userId: demoUser.id,
        title: 'Develop Contact Management System (Task 2)',
        description: 'Implement address & company info, search by email/phone, and duplicate prevention.',
        status: 'completed',
        priority: 'high',
        category: 'Work',
        dueDate: '2026-10-30',
        completedAt: new Date()
      },
      {
        userId: demoUser.id,
        title: 'Build To-Do List Backend with JWT Auth (Task 3)',
        description: 'Add user authentication, due dates, priority levels, categories, and test suite.',
        status: 'in-progress',
        priority: 'high',
        category: 'Work',
        dueDate: '2026-11-01'
      },
      {
        userId: demoUser.id,
        title: 'Review System Architecture and Docker Compose',
        description: 'Prepare documentation, Postman collection, and deployment steps.',
        status: 'pending',
        priority: 'medium',
        category: 'Study',
        dueDate: '2026-11-05'
      },
      {
        userId: demoUser.id,
        title: '30-minute Evening Cardio & Stretch',
        description: 'Daily fitness routine for developer posture and health.',
        status: 'pending',
        priority: 'low',
        category: 'Health',
        dueDate: '2026-10-31'
      }
    ]);

    console.log(`✓ Seeded ${tasks.length} tasks for demo user.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
