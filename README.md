# Student Management System

A full-stack web application that allows students to submit their details through a registration form and enables an admin to manage those records through a secure dashboard.

---

##  Features

###  Student Side

* Submit student details through a clean web form
* Fields include:

  * Full Name
  * Student Number
  * Email
  * Phone Number
  * Residence Choice

###  Admin Side

* Secure admin login (protected with sessions)
* Dashboard with:

  * View all students
  * Edit student details
  * Delete student records
  * Search by student number
  * Filter by residence
  * Export data to CSV

###  Dashboard Enhancements

* Summary cards:

  * Total students
  * Total residences
  * Latest student
* Dynamic filtering and live search

---

##  Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js (Express)
* **Database:** MySQL
* **Authentication:** Session-based (Express Session)

---

##  Project Structure

```
project-root/
│
├── public/              # Frontend files (HTML, CSS, JS)
├── admin/               # Admin dashboard pages
├── server.js            # Main Express server
├── db.js                # Database connection
├── package.json         # Dependencies
├── .env                 # Environment variables (NOT uploaded)
├── .gitignore           # Ignored files
└── AUTH_UPGRADE_PLAN.txt # Future improvements
```

---

##  Setup Instructions (Run Locally)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root folder:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_registration_db

ADMIN_USERNAME=yourAdminUsername
ADMIN_PASSWORD=yourAdminPassword

SESSION_SECRET=yourSecretKey
```

### 4. Setup MySQL Database

Run this SQL:

```sql
CREATE DATABASE student_registration_db;

USE student_registration_db;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    student_number VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    residence_choice VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Run the server

```bash
node server.js
```

### 6. Open in browser

```
http://localhost:3000
```

---

##  Admin Access

Access the admin panel:

```
http://localhost:3000/admin/login
```

Login using credentials from your `.env` file.

---

##  Export Feature

* Admin can export all student records as a CSV file
* Compatible with:

  * Excel
  * Google Sheets
  * Power BI

---

##  Security Notes

* `.env` file is excluded using `.gitignore`
* Sensitive data is not exposed in the repository
* Uses parameterized queries to prevent SQL injection

---

##  Future Improvements

Planned upgrades (see `AUTH_UPGRADE_PLAN.txt`):

* Move admin authentication to database
* Hash passwords using bcrypt
* Add forgot password functionality
* Implement OTP email verification
* Support multiple admin accounts

---

##  Purpose

This project demonstrates:

* Full-stack web development
* Database integration
* Authentication and session management
* CRUD operations
* Clean UI and admin dashboard design

---

##  Author

**Thabo Bradley Motsiri**

---

##  Notes

This project is currently designed for local use and demonstration.
Future deployment is possible.
