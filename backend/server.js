// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files (if both are in one project)
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// API endpoint to get student data
app.get('/api/student/:id', (req, res) => {
  const studentId = req.params.id;

  // In real DB case, you'd query based on id — for now, read from JSON
  const filePath = path.join(__dirname, 'data', 'studentData.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading student data:', err);
      return res.status(500).json({ error: 'Failed to read student data' });
    }

    const student = JSON.parse(data);
    // Optional: validate student ID
    if (student.id === studentId) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
