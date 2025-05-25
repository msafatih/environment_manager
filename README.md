# Environment Manager - Setup Guide

## Overview

**Environment Manager** is a web application for managing environment configurations across different projects and deployments. This README provides comprehensive instructions to set up the Environment Manager project from scratch.

---

## Table of Contents

-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
    -   [1. Clone the Repository](#1-clone-the-repository)
    -   [2. Install PHP Dependencies](#2-install-php-dependencies)
    -   [3. Install Node.js Dependencies](#3-install-nodejs-dependencies)
    -   [4. Configure Environment Variables](#4-configure-environment-variables)
    -   [5. Generate Application Key](#5-generate-application-key)
    -   [6. Database Configuration](#6-database-configuration)
    -   [7. Run Migrations and Seeders](#7-run-migrations-and-seeders)
    -   [8. Start Development Servers](#8-start-development-servers)
-   [Key Features](#key-features)
-   [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
-   [Contributing](#contributing)
-   [License](#license)
-   [Additional Resources](#additional-resources)
-   [Conclusion](#conclusion)

---

## Prerequisites

Before you begin, ensure you have the following installed:

-   PHP 8.1 or higher
-   Composer 2.x
-   Node.js 16.x or higher
-   npm 8.x or higher
-   MySQL 8.0 or PostgreSQL 13+
-   Git

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Biyuraaa/environment_manager.git
cd environment-manager
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Copy the `.env.example` file to `.env` and update the necessary environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file to set your database connection, application URL, and other configurations.

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Database Configuration

Ensure your database is set up and the credentials are correctly configured in the `.env` file.

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=env_manager
DB_USERNAME=root
DB_PASSWORD=

```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 7. Run Migrations and Seeders

```bash
php artisan migrate --seed
```

### 8. Start Development Servers

To start the Laravel development server, run:

```bash
php artisan serve
```

To start the Node.js development server, run:

```bash
npm run dev
```

### 9. Access the Application

Open your web browser and navigate to `http://localhost:8000` to access the Environment Manager application.

## Key Features

-   **Environment Management**: Create, update, and delete environment configurations.
-   **Project Management**: Organize environments by projects.
-   **User Authentication**: Secure access with user roles and permissions.
-   **API Integration**: RESTful API for external integrations.
-   **Real-time Updates**: Use WebSockets for real-time notifications and updates.
-   **Search and Filter**: Easily search and filter environments by various criteria.
-   **Audit Logs**: Track changes and actions performed in the application.

## Common Issues and Troubleshooting

-   **Database Connection Issues**: Ensure your database credentials in the `.env` file are correct and the database server is running.
-   **Missing Dependencies**: If you encounter missing class errors, ensure all Composer and npm dependencies are installed correctly.
-   **Cache Issues**: If you make changes to the configuration or routes, clear the cache using:
    ```bash
    php artisan config:cache
    php artisan route:cache
    ```
-   **Permission Issues**: Ensure the `storage` and `bootstrap/cache` directories are writable by the web server user.

## Contributing

We welcome contributions to the Environment Manager project! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear messages.
4. Push your changes to your forked repository.
5. Create a pull request explaining your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Additional Resources

-   [Laravel Documentation](https://laravel.com/docs)
-   [Node.js Documentation](https://nodejs.org/en/docs/)
-   [Composer Documentation](https://getcomposer.org/doc/)
-   [PHP Documentation](https://www.php.net/docs.php)

## Conclusion

Thank you for choosing Environment Manager! We hope this setup guide helps you get started quickly. If you have any questions or need further assistance, feel free to open an issue on the GitHub repository.
