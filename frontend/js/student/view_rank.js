document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.getElementById('hamburger');
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const profile = document.getElementById('profile');
            const profileDropdown = document.getElementById('profileDropdown');
            const searchInput = document.getElementById('searchInput');
            const refreshBtn = document.getElementById('refreshBtn');
            const dashboardBtn = document.getElementById('dashboardBtn');
            
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
            
            // Search functionality
            searchInput.addEventListener('input', function() {
                // This would filter the ranking data when populated
                console.log("Searching for:", this.value);
            });
            
            // Refresh button functionality
            refreshBtn.addEventListener('click', function() {
                // Add loading animation
                const originalText = refreshBtn.innerHTML;
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                refreshBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    refreshBtn.innerHTML = originalText;
                    refreshBtn.disabled = false;
                    alert('Rankings updated successfully!');
                }, 1500);
            });
            
            // Dashboard button functionality
            dashboardBtn.addEventListener('click', function() {
                window.location.href = 'student-dashboard.html';
            });

            // Example of how to populate data (for demonstration)
            // In a real application, you would fetch this data from your backend
            function populateRankingData() {
                // This is just an example - replace with actual data from your backend
                const rankingData = {
                    stats: {
                        totalStudents: 42,
                        yourRank: 3,
                        yourPercentage: 91.8,
                        yourGrade: "A"
                    },
                    rankings: [
                        { rank: 1, name: "Sarah Mitchell", rollNo: "S20230012", totalMarks: 492, percentage: 98.4, grade: "A+" },
                        { rank: 2, name: "Ryan Johnson", rollNo: "S20230028", totalMarks: 485, percentage: 97.0, grade: "A+" },
                        { rank: 3, name: "Alex Johnson", rollNo: "S20230045", totalMarks: 459, percentage: 91.8, grade: "A" },
                        // ... more students
                    ]
                };

                // This would be implemented when you have real data
                console.log("Ranking data ready to be populated:", rankingData);
            }

            // Call this function when your data is ready
            // populateRankingData();
        });