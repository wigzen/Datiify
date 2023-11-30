const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const limiter = require('./middleware/ratelimit')
const authenticateJWT = require('./middleware/auth')
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { Sequelize, DataTypes } = require('sequelize')

// Check if .env file exists
const envFilePath = path.join(__dirname, '.env')
const envExists = fs.existsSync(envFilePath)

// Load environment variables if .env exists
if (envExists) {
  dotenv.config({
    path: envFilePath,
    debug: true,
  })
}
const app = express()
const PORT = process.env.PORT || 3000

// Sequelize setup
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  }
)
// Define User model
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
// sequelize.sync({ force: true });

app.use(bodyParser.json())

// API endpoint for user registration
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
app.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    // Create a new user in the database
    const newUser = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
    })

    res
      .status(201)
      .json({ message: 'User registered successfully.', user: newUser })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// API endpoint for user authentication (login)
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
app.get('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    })

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Secure API endpoint with rate limiting
/**
 * @swagger
 * /secure-endpoint:
 *   get:
 *     summary: Access a secure endpoint
 *     responses:
 *       200:
 *         description: Access granted
 *       429:
 *         description: Too Many Requests
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */
app.get('/secure-endpoint', limiter, authenticateJWT, (req, res) => {
  res.status(200).json({ message: 'This is a secure endpoint.' })
})

// Swagger UI setup
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app // Export app for testing
