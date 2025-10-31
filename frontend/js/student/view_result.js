document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.getElementById('hamburger');
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const profile = document.getElementById('profile');
            const profileDropdown = document.getElementById('profileDropdown');
            const downloadBtn = document.getElementById('downloadBtn');
            
            // Toggle sidebar
            hamburger.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                mainContent.classList.toggle('sidebar-open');
                
                // Change hamburger icon
                const icon = hamburger.querySelector('i');
                if (sidebar.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
            
            // Toggle profile dropdown
            profile.addEventListener('click', function() {
                profileDropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!profile.contains(event.target) && !profileDropdown.contains(event.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
            
            // Close sidebar when clicking on a link (for mobile)
            const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth < 992) {
                        sidebar.classList.remove('active');
                        mainContent.classList.remove('sidebar-open');
                        hamburger.querySelector('i').classList.remove('fa-times');
                        hamburger.querySelector('i').classList.add('fa-bars');
                    }
                });
            });
            
            // Download button functionality
            downloadBtn.addEventListener('click', function() {
                // In a real app, this would generate and download a PDF
                alert('Report card download started! In a real application, this would generate a PDF file.');
                
                // Add a temporary loading effect
                const originalText = downloadBtn.innerHTML;
                downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                downloadBtn.disabled = true;
                
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                }, 2000);
            });

            // Example of how to populate data (for demonstration)
            // In a real application, you would fetch this data from your backend
            function populateResultData() {
                // This is just an example - replace with actual data from your backend
                const resultData = {
                    studentInfo: {
                        name: "Alex Johnson",
                        rollNo: "S20230045",
                        className: "Grade 10 - Section B",
                        academicYear: "2023-2024",
                        exam: "Final Term"
                    },
                    subjectMarks: [
                        { subject: "Mathematics", marksObtained: 98, totalMarks: 100, percentage: 98, grade: "A+" },
                        { subject: "Science", marksObtained: 92, totalMarks: 100, percentage: 92, grade: "A" },
                        { subject: "English", marksObtained: 88, totalMarks: 100, percentage: 88, grade: "B+" },
                        { subject: "Social Studies", marksObtained: 85, totalMarks: 100, percentage: 85, grade: "B" },
                        { subject: "Computer Science", marksObtained: 96, totalMarks: 100, percentage: 96, grade: "A+" }
                    ],
                    summary: {
                        totalMarks: 459,
                        percentage: 91.8,
                        overallGrade: "A",
                        resultStatus: "PASS"
                    }
                };

                // This would be implemented when you have real data
                console.log("Result data ready to be populated:", resultData);
            }

            // Call this function when your data is ready
            // populateResultData();
        });