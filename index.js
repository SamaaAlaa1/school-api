const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully');
    }
});

////////////////////////// Student Endpoints

// GET all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET one student by id
app.get("/students/:id", (req, res) => {
  db.query("SELECT * FROM students WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// POST add student
app.post("/students", (req, res) => {
  const { name, age, grade } = req.body;
  db.execute("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)", 
    [name, age, grade], 
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ id: results.insertId, name, age, grade });
    }
  );
});

// PUT update student
app.put("/students/:id", (req, res) => {
  const { name, age, grade } = req.body;
  db.execute("UPDATE students SET name=?, age=?, grade=? WHERE id=?", 
    [name, age, grade, req.params.id], 
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student updated" });
    }
  );
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  db.execute("DELETE FROM students WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Student deleted" });
  });
});

////////////////////////// Course Endpoints

// GET all courses
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST add course
app.post("/courses", (req, res) => {
  const { title, teacher, credits } = req.body;
  db.execute("INSERT INTO courses (title, teacher, credits) VALUES (?, ?, ?)", 
    [title, teacher, credits], 
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ id: results.insertId, title, teacher, credits });
    }
  );
});

// PUT update course
app.put("/courses/:id", (req, res) => {
  const { title, teacher, credits } = req.body;
  db.execute("UPDATE courses SET title=?, teacher=?, credits=? WHERE id=?", 
    [title, teacher, credits, req.params.id], 
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Course updated" });
    }
  );
});

// DELETE course
app.delete("/courses/:id", (req, res) => {
  db.execute("DELETE FROM courses WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Course deleted" });
  });
});


////////////////////////// Enrollment Endpoints

// POST enroll a student in a course
app.post("/enrollments", (req, res) => {
  const { student_id, course_id } = req.body;
  db.execute("INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)", 
    [student_id, course_id], 
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student enrolled in course" });
    }
  );
});

// GET all courses for a student
app.get("/students/:id/courses", (req, res) => {
  db.query(
    `SELECT c.id, c.title, c.teacher, c.credits 
     FROM courses c
     JOIN enrollments e ON c.id = e.course_id
     WHERE e.student_id = ?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// GET all students in a course
app.get("/courses/:id/students", (req, res) => {
  db.query(
    `SELECT s.id, s.name, s.age, s.grade 
     FROM students s
     JOIN enrollments e ON s.id = e.student_id
     WHERE e.course_id = ?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});