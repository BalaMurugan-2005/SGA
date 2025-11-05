const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const profile = document.getElementById('profile');
        const profileDropdown = document.getElementById('profileDropdown');
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKeyBtn = document.getElementById('apiKeyBtn');
        const getNewSuggestion = document.getElementById('getNewSuggestion');
        const suggestionsList = document.getElementById('suggestionsList');
        const chatInput = document.getElementById('chatInput');
        const simplifyBtn = document.getElementById('simplifyBtn');
        const chatMessages = document.getElementById('chatMessages');
        const currentRank = document.getElementById('currentRank');
        const badgesContainer = document.getElementById('badgesContainer');

        // Load data from localStorage
        document.addEventListener('DOMContentLoaded', function() {
            const savedRank = localStorage.getItem('studentRank');
            const savedBadges = localStorage.getItem('studentBadges');
            
            if (savedRank) {
                currentRank.textContent = savedRank;
            }
            
            if (savedBadges) {
                updateBadgesDisplay(JSON.parse(savedBadges));
            }
        });

        // Toggle sidebar
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-open');
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

        // Tab functionality
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current tab and content
                this.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });

        // API Key functionality
        let apiKey = '';
        apiKeyBtn.addEventListener('click', function() {
            apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                alert('API Key saved successfully!');
                apiKeyInput.type = 'password';
                // In a real implementation, you would validate the API key
            } else {
                alert('Please enter a valid API key');
            }
        });

        // Get New Suggestion
        getNewSuggestion.addEventListener('click', function() {
            if (!apiKey) {
                alert('Please enter your API key first');
                return;
            }
            
            // Show loading state
            const originalText = getNewSuggestion.innerHTML;
            getNewSuggestion.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating AI Suggestion...';
            getNewSuggestion.disabled = true;
            
            // Simulate API call to get AI suggestions
            setTimeout(() => {
                // In a real implementation, you would call the OpenAI API here
                const newSuggestions = [
                    "Focus on practicing geometry proofs for better understanding.",
                    "Create flashcards for vocabulary words to improve retention.",
                    "Review historical timelines to connect events better.",
                    "Solve physics numerical problems daily to build confidence."
                ];
                
                const randomSuggestion = newSuggestions[Math.floor(Math.random() * newSuggestions.length)];
                
                // Remove empty state if it exists
                if (suggestionsList.querySelector('.empty-state')) {
                    suggestionsList.innerHTML = '';
                }
                
                // Create new suggestion element
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.innerHTML = `
                    <div class="suggestion-title">AI Suggestion</div>
                    <div class="suggestion-desc">${randomSuggestion}</div>
                `;
                
                // Add to the top of suggestions list
                suggestionsList.prepend(suggestionItem);
                
                // Reset button
                getNewSuggestion.innerHTML = originalText;
                getNewSuggestion.disabled = false;
                
                // Update rank (simulate improvement)
                updateRank();
                
            }, 2000);
        });

        // Update rank function
        function updateRank() {
            const rankText = currentRank.textContent;
            
            // Initialize rank if no data exists
            if (rankText === 'No data yet') {
                currentRank.textContent = '20/20';
                localStorage.setItem('studentRank', '20/20');
                return;
            }
            
            const [current, total] = rankText.split('/').map(Number);
            
            // Simulate rank improvement
            if (current > 1) {
                const newRank = current - 1;
                currentRank.textContent = `${newRank}/${total}`;
                localStorage.setItem('studentRank', `${newRank}/${total}`);
                
                // Add a new badge if rank improves significantly
                if (newRank <= 3) {
                    addBadge(newRank);
                }
            }
        }

        // Add badge function
        function addBadge(rank) {
            const badgeTypes = ['gold', 'silver', 'bronze'];
            const badgeText = ['1st', '2nd', '3rd'];
            
            if (rank >= 1 && rank <= 3) {
                const badgeType = badgeTypes[rank-1];
                
                // Remove empty state if it exists
                if (badgesContainer.querySelector('.empty-state')) {
                    badgesContainer.innerHTML = '';
                }
                
                // Create badge element
                const badgeElement = document.createElement('div');
                badgeElement.className = `rank-badge ${badgeType}`;
                badgeElement.textContent = badgeText[rank-1];
                
                // Add to badges container
                badgesContainer.appendChild(badgeElement);
                
                // Save to localStorage
                const savedBadges = localStorage.getItem('studentBadges') || '{}';
                const badges = JSON.parse(savedBadges);
                badges[badgeType] = badgeText[rank-1];
                localStorage.setItem('studentBadges', JSON.stringify(badges));
            }
        }

        // Update badges display function
        function updateBadgesDisplay(badges) {
            // Clear current badges
            badgesContainer.innerHTML = '';
            
            // Add each badge
            Object.entries(badges).forEach(([type, text]) => {
                const badgeElement = document.createElement('div');
                badgeElement.className = `rank-badge ${type}`;
                badgeElement.textContent = text;
                badgesContainer.appendChild(badgeElement);
            });
        }

        // Simplify text with AI
        simplifyBtn.addEventListener('click', function() {
            const text = chatInput.value.trim();
            if (!text) {
                alert('Please enter some text to simplify');
                return;
            }
            
            if (!apiKey) {
                alert('Please enter your API key first');
                return;
            }
            
            // Add user message to chat
            addMessageToChat(text, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            const typingIndicator = addMessageToChat('Simplifying your text...', 'bot');
            
            // Simulate API call to OpenAI
            setTimeout(() => {
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                
                // In a real implementation, you would call the OpenAI API here
                // For demo purposes, we'll generate a simple response
                const simplifiedText = generateSimplifiedText(text);
                addMessageToChat(simplifiedText, 'bot');
            }, 2000);
        });

        // Function to generate simplified text (demo purposes)
        function generateSimplifiedText(text) {
            // Default simplified response
            return `In simple terms: "${text}" means... (This is a simplified explanation. In a real app, the AI would provide a proper explanation based on the context.)`;
        }

        function addMessageToChat(message, sender) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageElement;
        }