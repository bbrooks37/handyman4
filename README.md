# Handyman Website

Welcome to the Handyman Website repository! This project is built with React and Vite for the frontend, and a Node.js server with Express for the backend. The website offers various handyman services for users in Lakeland, FL.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Database Schema](#database-schema)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To run this website locally, follow these steps:

1.  Clone the repository:
    ```bash
    git clone <GitHub_repository_URL>
    ```

2.  Change directory to the backend:
    ```bash
    cd backend
    ```

3.  Install backend dependencies:
    ```bash
    npm install
    ```

4.  Start the server:
    ```bash
    node server.cjs
    ```

5.  Open a new terminal and change directory to the frontend:
    ```bash
    cd ../src
    ```

6.  Install frontend dependencies:
    ```bash
    npm install
    ```

7.  Start the frontend server:
    ```bash
    npm run dev
    ```

This will open the website in your default browser at `http://localhost:3000`.

## Project Structure

```plaintext
handyman3/
├── backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── tests/
│   │   └── server.test.js
│   ├── server.cjs
│   ├── package.json
│   └── .env
├── src/
│   ├── components/
│   │   ├── ContactPage.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ThankYou.jsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── index.html
│   ├── App.css
│   └── package.json
└── README.md
Dependencies
Backend
express

cors

helmet

morgan

express-rate-limit

dotenv

pg

express-validator

Frontend
react

react-dom

react-router-dom

Database Schema
The database schema consists of the following tables:

Handy Services Table
plaintext
+-------------------+-------------+---------------------------------------------------+
| Column            | Data Type   | Description                                       |
+-------------------+-------------+---------------------------------------------------+
| id                | INTEGER     | Unique identifier for each service                |
| service_type      | VARCHAR     | The type of the service provided                  |
| description       | TEXT        | A detailed description of the service             |
| price             | NUMERIC     | The price of the service                          |
| location          | VARCHAR     | The location where the service is provided        |
| date_of_service   | DATE        | The date when the service is provided (nullable)  |
| user_id           | INTEGER     | The ID of the user associated with the service    |
+-------------------+-------------+---------------------------------------------------+
Moving Table
plaintext
+-----------------------+-------------+-----------------------------------------------+
| Column                | Data Type   | Description                                   |
+-----------------------+-------------+-----------------------------------------------+
| id                    | INTEGER     | Unique identifier for each moving service     |
| service_name          | VARCHAR     | The name of the moving service                |
| description           | TEXT        | A detailed description of the moving service  |
| price                 | NUMERIC     | The price of the moving service               |
| origin_location       | VARCHAR     | The origin location of the move               |
| destination_location  | VARCHAR     | The destination location of the move          |
| move_date             | DATE        | The date of the move (nullable)               |
| user_id               | INTEGER     | The ID of the user associated with the move   |
| service_type          | VARCHAR     | The type of the service                       |
| location              | VARCHAR     | The location where the service is provided    |
| date_of_service       | DATE        | The date when the service is provided (nullable)|
+-----------------------+-------------+-----------------------------------------------+
Mulching Table
plaintext
+-------------------+-------------+---------------------------------------------------+
| Column            | Data Type   | Description                                       |
+-------------------+-------------+---------------------------------------------------+
| id                | INTEGER     | Unique identifier for each mulching service       |
| material          | VARCHAR     | The type of mulch material used                   |
| area_sq_ft        | NUMERIC     | The area in square feet to be mulched             |
| price             | NUMERIC     | The price of the mulching service                 |
| description       | TEXT        | A detailed description of the mulching service    |
| location          | VARCHAR     | The location where the service is provided        |
| date_of_service   | DATE        | The date when the service is provided (nullable)  |
| user_id           | INTEGER     | The ID of the user associated with the service    |
+-------------------+-------------+---------------------------------------------------+
Services Table
plaintext
+----------------+-------------+-----------------------------------------------+
| Column         | Data Type   | Description                                   |
+----------------+-------------+-----------------------------------------------+
| id             | INTEGER     | Unique identifier for each service            |
| service_name   | VARCHAR     | The name of the service                       |
| description    | TEXT        | A detailed description of the service         |
| duration       | VARCHAR     | The duration of the service                   |
| price          | NUMERIC     | The price of the service                      |
| image          | VARCHAR     | URL to an optional image of the service       |
+----------------+-------------+-----------------------------------------------+
Users Table
plaintext
+-----------------+-------------+---------------------------------------------+
| Column          | Data Type   | Description                                 |
+-----------------+-------------+---------------------------------------------+
| id              | INTEGER     | Unique identifier for each user             |
| username        | VARCHAR     | The username of the user                    |
| password        | VARCHAR     | The password of the user                    |
| email           | VARCHAR     | The email address of the user               |
| location        | VARCHAR     | The location of the user (nullable)         |
| login_attempts  | INTEGER     | The number of login attempts (default to 0) |
| lockout_until   | TIMESTAMP   | The time until the user is locked out       |
|                 |             | (nullable)                                  |
+-----------------+-------------+---------------------------------------------+
Running Tests
To run tests for the backend, follow these steps:

Change directory to the backend:

bash
cd backend
Run tests:

bash
npm test
Deployment
To deploy the Handyman Website, you can use a platform like Vercel for the frontend and a hosting service like Heroku for the backend.

Frontend Deployment
Build the frontend:

bash
cd src
npm run build
Deploy using Vercel: Follow the instructions on Vercel's website to deploy the frontend.

Backend Deployment
Deploy using Heroku: Follow the instructions on Heroku's website to deploy the backend.

Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

License
This project is licensed under the MIT License. See the LICENSE file for details.


This README.md file provides a comprehensive guide to understanding, running, and contributing to the Handyman
