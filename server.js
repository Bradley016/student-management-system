require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Public student files
app.use(express.static(path.join(__dirname, "public")));

// Serve admin JS file
app.use(express.static(path.join(__dirname, "admin")));

// Email validation
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Middleware to protect admin routes
function isAdminLoggedIn(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

// ---------------- PUBLIC ROUTES ----------------

// Student form submission
app.post("/register", (req, res) => {
  const { fullName, studentNumber, email, phoneNumber, residenceChoice } = req.body;

  if (!fullName || !studentNumber || !email || !phoneNumber || !residenceChoice) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address."
    });
  }

  const sql = `
    INSERT INTO students (full_name, student_number, email, phone_number, residence_choice)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [fullName, studentNumber, email, phoneNumber, residenceChoice];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Student number or email already exists."
        });
      }

      return res.status(500).json({
        success: false,
        message: "Database error. Please try again later."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student registered successfully."
    });
  });
});

// ---------------- ADMIN ROUTES ----------------

// Show admin login page
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

// Process admin login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({
      success: true,
      message: "Login successful."
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password."
  });
});

// Protected dashboard page
app.get("/admin/dashboard", isAdminLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "dashboard.html"));
});

// Protected route to fetch students
app.get("/admin/students", isAdminLoggedIn, (req, res) => {
  const sql = "SELECT * FROM students ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database error while fetching students."
      });
    }

    return res.status(200).json({
      success: true,
      students: results
    });
  });
});

// Protected route to export students as CSV
app.get("/admin/export", isAdminLoggedIn, (req, res) => {
  const sql = "SELECT * FROM students ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error exporting students:", err.message);
      return res.status(500).send("Database error while exporting students.");
    }

    let csv =
      "ID,Full Name,Student Number,Email,Phone Number,Residence Choice,Created At\n";

    results.forEach((student) => {
      csv += `${student.id},"${student.full_name}","${student.student_number}","${student.email}","${student.phone_number}","${student.residence_choice}","${student.created_at}"\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    return res.send(csv);
  });
});

// Protected route to delete a student
// Protected route to update a student
app.put("/admin/students/:id", isAdminLoggedIn, (req, res) => {
  const studentId = req.params.id;
  const { fullName, studentNumber, email, phoneNumber, residenceChoice } = req.body;

  if (!fullName || !studentNumber || !email || !phoneNumber || !residenceChoice) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address."
    });
  }

  const sql = `
    UPDATE students
    SET full_name = ?, student_number = ?, email = ?, phone_number = ?, residence_choice = ?
    WHERE id = ?
  `;

  const values = [fullName, studentNumber, email, phoneNumber, residenceChoice, studentId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating student:", err.message);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Student number or email already exists."
        });
      }

      return res.status(500).json({
        success: false,
        message: "Database error while updating student."
      });
    }

    return res.json({
      success: true,
      message: "Student updated successfully."
    });
  });
});

// Logout
app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not log out."
      });
    }

    return res.json({
      success: true,
      message: "Logged out successfully."
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});