require('dotenv').config();
const { sequelize, Student, Course, Enrollment } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced with force: true');

    // Seed Courses
    const courses = await Course.bulkCreate([
      {
        courseCode: 'CS101',
        title: 'Introduction to Computer Science',
        description: 'Fundamental principles of computing, problem-solving, and programming.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Dr. Alan Turing',
        maxCapacity: 30
      },
      {
        courseCode: 'CS201',
        title: 'Data Structures and Algorithms',
        description: 'Abstract data types, complexity analysis, trees, graphs, and sorting.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Dr. Donald Knuth',
        maxCapacity: 25
      },
      {
        courseCode: 'MATH150',
        title: 'Linear Algebra and Differential Equations',
        description: 'Matrix algebra, vector spaces, eigenvalues, and ordinary differential equations.',
        credits: 3,
        department: 'Mathematics',
        instructor: 'Dr. Katherine Johnson',
        maxCapacity: 40
      },
      {
        courseCode: 'ENG210',
        title: 'Technical Communication & Ethics',
        description: 'Professional engineering writing, presentations, and ethical dilemmas in tech.',
        credits: 3,
        department: 'Humanities',
        instructor: 'Prof. Mary Shelley',
        maxCapacity: 35
      },
      {
        courseCode: 'DB301',
        title: 'Database Management Systems',
        description: 'Relational design, normalization, indexing, SQL, and query optimization.',
        credits: 4,
        department: 'Information Technology',
        instructor: 'Dr. Edgar Codd',
        maxCapacity: 30
      }
    ]);
    console.log(`✓ Seeded ${courses.length} courses`);

    // Seed Students
    const students = await Student.bulkCreate([
      {
        studentIdNumber: 'STU1001',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@university.edu',
        phone: '+1-555-0101',
        dateOfBirth: '2003-04-12',
        department: 'Computer Science',
        enrollmentYear: 2023,
        status: 'Active'
      },
      {
        studentIdNumber: 'STU1002',
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob.williams@university.edu',
        phone: '+1-555-0102',
        dateOfBirth: '2002-11-20',
        department: 'Computer Science',
        enrollmentYear: 2022,
        status: 'Active'
      },
      {
        studentIdNumber: 'STU1003',
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@university.edu',
        phone: '+1-555-0103',
        dateOfBirth: '2004-01-15',
        department: 'Mathematics',
        enrollmentYear: 2024,
        status: 'Active'
      },
      {
        studentIdNumber: 'STU1004',
        firstName: 'Diana',
        lastName: 'Prince',
        email: 'diana.prince@university.edu',
        phone: '+1-555-0104',
        dateOfBirth: '2003-08-30',
        department: 'Information Technology',
        enrollmentYear: 2023,
        status: 'Active'
      },
      {
        studentIdNumber: 'STU1005',
        firstName: 'Ethan',
        lastName: 'Hunt',
        email: 'ethan.hunt@university.edu',
        phone: '+1-555-0105',
        dateOfBirth: '2001-07-04',
        department: 'Computer Science',
        enrollmentYear: 2021,
        status: 'Graduated'
      }
    ]);
    console.log(`✓ Seeded ${students.length} students`);

    // Seed Enrollments
    const enrollments = await Enrollment.bulkCreate([
      {
        studentId: students[0].id,
        courseId: courses[0].id,
        enrollmentDate: '2023-09-01',
        grade: 'A',
        status: 'Completed'
      },
      {
        studentId: students[0].id,
        courseId: courses[1].id,
        enrollmentDate: '2024-01-15',
        grade: 'Pending',
        status: 'Enrolled'
      },
      {
        studentId: students[1].id,
        courseId: courses[1].id,
        enrollmentDate: '2024-01-15',
        grade: 'Pending',
        status: 'Enrolled'
      },
      {
        studentId: students[2].id,
        courseId: courses[2].id,
        enrollmentDate: '2024-01-15',
        grade: 'B+',
        status: 'Completed'
      },
      {
        studentId: students[3].id,
        courseId: courses[4].id,
        enrollmentDate: '2024-02-01',
        grade: 'Pending',
        status: 'Enrolled'
      }
    ]);
    console.log(`✓ Seeded ${enrollments.length} enrollments`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
