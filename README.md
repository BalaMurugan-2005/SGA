🎓 Student Grade Calculator
📘 Project Overview

The Student Grade Calculator is a web-based application designed to simplify and automate the process of managing student grades. 
It provides role-based access for Teachers and Students, ensuring that both users can efficiently perform their respective tasks in an organized and user-friendly interface.
The system eliminates manual grade calculations by automatically generating grades based on the marks entered by teachers. 
It also offers additional features such as voice-based mark entry, result publication, and ranking visualization for enhanced usability and efficiency.



👩‍🏫 Teacher Module

The Teacher Dashboard empowers educators to manage student marks and results effortlessly. It includes three main sections:

1. Teacher Dashboard

Displays teacher details such as:

Name

ID

Email

Subject

Class handled

This page serves as the main overview for teachers to manage their activities.

2. Mark Entry Page

This page allows teachers to input student marks efficiently. It is divided into two tabs:

🔹 Marks Entry Tab

Displays two sections: Unmarked Students and Marked Students.

Teachers can enter marks for unmarked students manually or through voice input using a “Voice Entry” feature.

Once marks are entered, teachers can save the data for automatic grade calculation.

🔹 Publish Result Tab

Before publishing, the system verifies whether all student marks are properly graded.

Once validated, teachers can publish the final results for all students with a single click.

3. View Rank Page

Displays the overall ranking of students based on their performance.

Helps teachers analyze student progress and identify top performers.

🧑‍🎓 Student Module

The Student Dashboard provides each student with personalized academic information and access to their results and rankings.

1. Student Dashboard

Displays essential student details such as:

Name

Roll Number

Class

Academic Year

Attendance

This page provides a quick overview of the student’s academic profile.

2. View Result Page

Shows the detailed result of the student including subject-wise marks, grades, and overall performance.

Automatically calculates and displays grades based on predefined criteria.

Ensures transparency and accuracy in student evaluation.

3. View Rank Page

Allows students to view their rank position among classmates.

Displays a leaderboard-like interface, motivating students to improve their academic performance.


💡 Conclusion

The Student Grade Calculator is an innovative solution that bridges the gap between manual grading and digital automation.
By integrating intelligent features like automatic grade computation, voice-enabled data entry, and dynamic ranking, 
it streamlines academic management for both teachers and students — making the entire process faster, smarter, and more reliable



🚀 How to Run the Project

Follow these simple steps to run the Student Grade Calculator project on your system 👇

🧑‍🏫 For Teacher

Open your project folder in VS Code.

Open a terminal and run the backend for teachers:

cd backend

node teacherserver.js


Then open frontend/teacher/teacher_dashboard.html using Live Server.

The teacher dashboard will open — now you can enter marks, publish results, and view ranks.

🧑‍🎓 For Student

Open a new terminal (keep the teacher server running).

Run the student backend:

cd backend

node server.js


Then open frontend/student/student_dashboard.html using Live Server.

The student dashboard will open — you can view marks, grades, and ranks.
