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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./src/middlewares/passport")(passport);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
