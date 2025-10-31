document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const profile = document.getElementById('profile');
    const profileDropdown = document.getElementById('profileDropdown');

    // Sidebar toggle
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-open');

        const icon = hamburger.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Profile dropdown
    profile.addEventListener('click', function() {
        profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!profile.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Sidebar close on link click (mobile)
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-open');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // ✅ Fetch student data from backend API
    async function loadStudentData() {
        try {
            const studentId = "S20230045"; // This could come from login/session later
            const response = await fetch(`http://localhost:5000/api/student/${studentId}`);
            const data = await response.json();

            console.log("Student data from backend:", data);

            // Example: populate UI
            document.querySelector('.cards-container .card:nth-child(1) .data-placeholder').innerHTML = `
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Roll No:</strong> ${data.id}</p>
                <p><strong>Class:</strong> ${data.className}</p>
                <p><strong>Academic Year:</strong> ${data.academicYear}</p>
                <p><strong>Attendance:</strong> ${data.attendance}</p>
            `;
        } catch (err) {
            console.error("Error fetching student data:", err);
        }
    }

    loadStudentData();
});
