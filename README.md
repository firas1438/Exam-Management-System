# Exam-Management-System
Role-based web application designed to facilitate the exam scheduling procedure.

![App Preview](https://i.imgur.com/RTyua2b.png)

## Features
- Dashboard that provides multiple statistics and graphs related to exams, available classes and supervisors.
- Manage exams, classes, and supervisors with full CRUD capabilities (Create, Read, Update, Delete).
- Automate exam schedule distribution via email notifications.
- Maintain session history for documentation purposes.

## Existing Roles
1. Admin
2. Department Chief
3. Studies Director

## Technologies Used
- TypeScript
- Next.js
- Framer Motion
- Tailwind CSS
- Recharts
- Prisma ORM
- JWT (JSON Web Tokens)
- MySQL

## Getting Started

1. Clone the project
   ```bash
   git clone https://github.com/firas1438/Exam-Management-System.git
   cd exam-management-system
   ```

2. Create a .env file in the root directory and add your environment variables.
   ```bash
   PORT=xxxx
   DATABASE_URL="your_database_url_here"
   ACCESS_TOKEN_SECRET=your_access_token_here
   REFRESH_TOKEN_SECRET=your_refresh_token_here
   ```

3. Install dependencies
   ```bash
   npm install
   ```
