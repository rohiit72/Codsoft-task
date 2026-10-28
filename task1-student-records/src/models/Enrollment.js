const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  grade: {
    type: DataTypes.ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'Pending'),
    defaultValue: 'Pending'
  },
  status: {
    type: DataTypes.ENUM('Enrolled', 'Completed', 'Dropped'),
    defaultValue: 'Enrolled'
  }
}, {
  timestamps: true,
  tableName: 'enrollments',
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'courseId']
    }
  ]
});

module.exports = Enrollment;
