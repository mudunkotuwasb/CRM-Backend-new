require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const { success } = require("consola");
const { PORT } = require("./src/config");
const connectDB = require("./src/config/database");
const routers = require("./src/routes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./src/middlewares/passport")(passport);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route handler - ADD THIS
app.get('/', (req, res) => {
  res.json({
    message: 'CRM Backend API is running',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    documentation: '/api-docs',
    api_base: '/api'
  });
});

// Health check endpoint - OPTIONAL
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CRM Backend',
    uptime: process.uptime()
  });
});

// Routes
app.use("/api", routers);

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    success({
      message: `🚀 Server is running on port ${PORT}`,
      badge: true,
    });
    console.log('Swagger docs at http://localhost:4000/api-docs');
  });
};

startServer();