# Datiify - backend

## Table of Contents

- [Datiify - backend](#datiify---backend)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Local Setup](#local-setup)
  - [Express Rate Limit Strategy](#express-rate-limit-strategy)

## Getting Started

### Local Setup

Follow these steps to set up the project locally.

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/wigzen/Datiify.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd Datiify
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Create Environment Variables:**
   Create a .env file in the project root and add the necessary environment variables.

   ```bash
   JWT_SECRET_KEY = your-secret-key
   DB_NAME = postgres
   DB_USER = postgres
   DB_PASS = admin
   DB_HOST = localhost
   DB_PORT=3306
   ```

5. **Run the Application:**

   ```bash
   npm run dev
   ```

6. **Run the Tests:**

   ```bash
   npm test
   ```

## Express Rate Limit Strategy

This project uses the express-rate-limit middleware for rate limiting. The rate-limiting strategy is based on the token bucket algorithm.

**Configuration Options:**

- windowMs: The time window for which the rate limit applies, specified in milliseconds.
- max: The maximum number of requests allowed in the specified time window.
- handler: A custom function to handle requests that exceed the rate limit.
- headers: Optional headers to be added to the response when the rate limit is exceeded.

**Headers in Response:**

- X-RateLimit-Limit: The maximum number of requests allowed in the current time window.
- X-RateLimit-Remaining: The number of requests remaining in the current time window.
- X-RateLimit-Reset: The time at which the current rate limit window resets (in UTC epoch seconds).
