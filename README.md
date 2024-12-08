## 🛠️ **Technologies Used**

- **NGINX**: Reverse proxy to protect routes, provide flexibility for **load balancers**, and improve application security.
- **Docker**: The entire application (frontend and backend) was **containerized**, ensuring portability and ease of deployment.
- **RabbitMQ**: Messaging system implemented with **Producer** and **Consumer** for asynchronous task processing.

---

## 📦 **Backend**

- **Framework**: Developed with **NestJS**, using **Sequelize** as ORM and **MariaDB** as the database.
- **Architecture**: Follows the **DDD (Domain-Driven Design)** pattern for better organization and scalability.
  **RabbitMQ Messaging**:
  - Queue implementation for **repository addition**, ensuring efficient and asynchronous task processing.
- **Authentication**:
  - Payloads protected using **Crypto**.
  - Passwords hashed with **bcrypt** for maximum security.
  - Implementation of **JWT (JSON Web Token)** for authentication and access control.
- **Features**:
  - **Pagination and Sorting**: Allows sorting records by **date** and easily navigating between pages.
  - **Secure Routes**: Only authenticated users can access the APIs, requiring a valid token.
- **API Documentation**:
  - **Swagger**: The endpoint documentation has been implemented with Swagger and can be accessed at http://localhost:5500/api-docs#/.
---

## 🖥️ **Frontend**

- **Framework**: Built with **React** and **Next.js**.
- **UI Framework**: Uses **Material-UI (MUI)** for elegant styling and reusable components.
- **Global State**:
  - Managed with **Redux**, using **Thunks** to handle asynchronous calls.
- **Testing**: End-to-end (E2E) tests implemented with **Cypress**.
- **Features**:
  - **Precise Filters**: Enable refined result filtering with high accuracy.
  - **Responsive Layout**: Interface adapts to different screen sizes.
  - **Color Scheme Switching**: Users can change the application’s color scheme.
  - **Repository Management**:
    - **Edit and Delete**: Full control over repositories.
    - **Hide Columns**: Feature implemented to demonstrate table customization.
  - **Protected Routes**: Only authenticated users can navigate and consume APIs.

---

## 🔧 **Key Features**

- **Security First**: Protected payloads, secure passwords, and JWT authentication.
- **Performance**: Use of **Docker** and **NGINX** to optimize performance.
- **Scalability**: DDD architecture and Docker ensure support for application growth.
- **User Experience**: Modern, responsive interface with customization options.

---

## 🚀 **How to Run the Project**

### 🔧 **Prerequisites**

1. Docker and Docker Compose installed.
2. A `.env` file in the same directory as the `docker-compose.yml` file with the following environment variables:

### 📋 **Example `.env`**

````bash
DB_HOST=mariadb
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_DB=mydb
RABBITMQ_URL=amqp://rabbitmq-my:5672
PORT=3000

### 🏗️ **Steps**

```bash
# Start services with Docker Compose
docker-compose up --build

# Frontend will be accessible at http://localhost:3000
# Backend will be available at http://localhost:5500
````
