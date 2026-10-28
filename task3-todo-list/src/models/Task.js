const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 150]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  category: {
    type: DataTypes.ENUM('Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'),
    defaultValue: 'Work'
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'tasks',
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['dueDate'] }
  ],
  hooks: {
    beforeSave: (task) => {
      if (task.changed('status')) {
        if (task.status === 'completed' && !task.completedAt) {
          task.completedAt = new Date();
        } else if (task.status !== 'completed') {
          task.completedAt = null;
        }
      }
    }
  }
});

module.exports = Task;
