const express = require('express');
const config = require('./config');
const sequelize = require('./config/database');
require('./models');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));

app.use('/api/v1', require('./routes/v1'));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    app.listen(config.port, () => {
      console.log(`Product service running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start product service:', err);
    process.exit(1);
  }
};

start();