require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5002;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ SQLite Database connected successfully.');

    await sequelize.sync({ alter: false });
    console.log('✓ Contacts database tables synchronized.');

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Contact Management System API is running!`);
      console.log(` Server URL: http://localhost:${PORT}`);
      console.log(` Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
