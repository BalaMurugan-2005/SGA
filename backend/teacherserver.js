// ===============================
// 🚀 Consolidated Teacher Server
// ===============================
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// ===============================
// 📁 File Paths Configuration
// ===============================
const dataDir = path.join(__dirname, 'data', 'teacher');
const teacherDataPath = path.join(dataDir, 'teacherData.json');
const marksDataPath = path.join(dataDir, 'studentsMarks.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// ===============================
// 🔧 Utility Functions
// ===============================
const readJSONFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File doesn't exist, return empty array
                    resolve([]);
                } else {
                    reject(err);
                }
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
};

const writeJSONFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// ===============================
// 🎯 API Routes
// ===============================

// 👩‍🏫 Fetch Teacher Profile
app.get('/api/teacher/:id', async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teachers = await readJSONFile(teacherDataPath);
        const teacher = teachers.find(t => t.id === teacherId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        res.json(teacher);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 👩‍🏫 Update Teacher Profile
app.put('/api/teacher/:id', async (req, res) => {
    try {
        const teacherId = req.params.id;
        const updatedData = req.body;
        
        const teachers = await readJSONFile(teacherDataPath);
        const teacherIndex = teachers.findIndex(t => t.id === teacherId);
        
        if (teacherIndex === -1) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        
        teachers[teacherIndex] = { ...teachers[teacherIndex], ...updatedData };
        await writeJSONFile(teacherDataPath, teachers);
        
        res.json({ message: 'Teacher profile updated successfully', teacher: teachers[teacherIndex] });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🎓 Fetch All Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await readJSONFile(marksDataPath);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🎓 Fetch Single Student by ID
app.get('/api/student/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const students = await readJSONFile(marksDataPath);
        const student = students.find(s => s.id === studentId);
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ✏️ Update Marks for a Student
app.post('/api/student/:id/marks', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { marks } = req.body;

        // Validate marks
        if (!marks || typeof marks !== 'object') {
            return res.status(400).json({ error: 'Invalid marks data' });
        }

        const requiredSubjects = ['tamil', 'english', 'maths', 'science', 'social'];
        for (const subject of requiredSubjects) {
            if (marks[subject] === undefined || marks[subject] === null) {
                return res.status(400).json({ error: `Missing marks for ${subject}` });
            }
            if (marks[subject] < 0 || marks[subject] > 100) {
                return res.status(400).json({ error: `Invalid marks for ${subject}. Must be between 0-100` });
            }
        }

        const students = await readJSONFile(marksDataPath);
        const studentIndex = students.findIndex(s => s.id === studentId);

        if (studentIndex === -1) {
            return res.status(404).json({ error: 'Student not found' });
        }

        students[studentIndex].marks = marks;
        await writeJSONFile(marksDataPath, students);

        res.json({ 
            message: 'Marks updated successfully', 
            student: students[studentIndex] 
        });
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 📊 Get Class Rankings
app.get('/api/rankings', async (req, res) => {
    try {
        const students = await readJSONFile(marksDataPath);
        
        // Process rankings
        const rankings = students
            .filter(student => student.marks !== null)
            .map(student => {
                const marks = student.marks;
                const total = Object.values(marks).reduce((sum, mark) => sum + mark, 0);
                const average = (total / (Object.keys(marks).length * 100)) * 100;
                const grade = calculateGrade(average);
                
                return {
                    ...student,
                    total,
                    average: Math.round(average * 10) / 10,
                    grade
                };
            })
            .sort((a, b) => b.total - a.total);
        
        res.json(rankings);
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 📈 Get Class Statistics
app.get('/api/statistics', async (req, res) => {
    try {
        const students = await readJSONFile(marksDataPath);
        const studentsWithMarks = students.filter(student => student.marks !== null);
        
        if (studentsWithMarks.length === 0) {
            return res.json({
                totalStudents: students.length,
                studentsWithMarks: 0,
                classAverage: 0,
                topScore: 0,
                passPercentage: 0
            });
        }
        
        // Calculate statistics
        const totals = studentsWithMarks.map(student => 
            Object.values(student.marks).reduce((sum, mark) => sum + mark, 0)
        );
        
        const classAverage = totals.reduce((sum, total) => sum + total, 0) / totals.length;
        const topScore = Math.max(...totals);
        const passPercentage = (studentsWithMarks.filter(student => {
            const average = Object.values(student.marks).reduce((sum, mark) => sum + mark, 0) / Object.keys(student.marks).length;
            return average >= 40;
        }).length / studentsWithMarks.length) * 100;
        
        res.json({
            totalStudents: students.length,
            studentsWithMarks: studentsWithMarks.length,
            classAverage: Math.round(classAverage),
            topScore: topScore,
            passPercentage: Math.round(passPercentage)
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 📤 Export Rankings to CSV
app.get('/api/export/rankings', async (req, res) => {
    try {
        const students = await readJSONFile(marksDataPath);
        
        const processedStudents = students
            .filter(student => student.marks !== null)
            .map(student => {
                const marks = student.marks;
                const total = Object.values(marks).reduce((sum, mark) => sum + mark, 0);
                const average = (total / (Object.keys(marks).length * 100)) * 100;
                const grade = calculateGrade(average);
                
                return {
                    ...student,
                    total,
                    average: Math.round(average * 10) / 10,
                    grade
                };
            })
            .sort((a, b) => b.total - a.total);
        
        let csvContent = "Rank,Student Name,Roll No,Class,Tamil,English,Maths,Science,Social,Total,Average,Grade\n";
        
        processedStudents.forEach((student, index) => {
            const rank = index + 1;
            const row = [
                rank,
                `"${student.name}"`,
                student.rollNo,
                student.class,
                student.marks.tamil,
                student.marks.english,
                student.marks.maths,
                student.marks.science,
                student.marks.social,
                student.total,
                student.average,
                student.grade
            ];
            csvContent += row.join(',') + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=class_rankings.csv');
        res.send(csvContent);
        
    } catch (error) {
        console.error('Error exporting rankings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🎯 Grade Calculation Helper
function calculateGrade(average) {
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B';
    if (average >= 60) return 'C';
    if (average >= 40) return 'D';
    return 'F';
}

// ===============================
// 🏠 Serve HTML Pages
// ===============================

// Serve Teacher Dashboard
app.get('/teacher/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/Teacher/Teacher_DashBoard.html'));
});

// Serve Marks Entry Page
app.get('/teacher/marks', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/Teacher/mark_entry.html'));
});

// Serve Rankings Page
app.get('/teacher/rankings', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/Teacher/teacher_rank.html'));
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Consolidated Teacher server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET  /api/teacher/:id`);
    console.log(`   PUT  /api/teacher/:id`);
    console.log(`   GET  /api/students`);
    console.log(`   GET  /api/student/:id`);
    console.log(`   POST /api/student/:id/marks`);
    console.log(`   GET  /api/rankings`);
    console.log(`   GET  /api/statistics`);
    console.log(`   GET  /api/export/rankings`);
});