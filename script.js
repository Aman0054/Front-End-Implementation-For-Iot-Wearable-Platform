// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Authentication
    initAuth();
    
    // Event listeners for navigation
    setupNavigation();
    
    // Form submissions
    setupFormSubmissions();
    
    // Setup modals
    setupModals();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize mock data
    initializeMockData();
    
    // Setup data sync and device connection
    setupDataSync();
    
    // Setup provider communication
    setupProviderCommunication();
});

// ----- AUTHENTICATION MODULE -----

// Initialize authentication
function initAuth() {
    // Check for existing token in local storage
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (token && userData.email) {
        // User is logged in
        showAuthenticatedUI(userData);
    } else {
        // User is not logged in
        showLoginForm();
    }
}

// Show authenticated UI
function showAuthenticatedUI(userData) {
    // Hide auth section and show app content
    const authSection = document.getElementById('auth-section');
    const appContent = document.getElementById('app-content');
    
    if (authSection && appContent) {
        authSection.classList.add('d-none');
        appContent.classList.remove('d-none');
    }
    
    // Update user name in navbar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && userData.name) {
        userNameElement.textContent = userData.name;
    } else if (userNameElement) {
        userNameElement.textContent = userData.email ? userData.email.split('@')[0] : 'User';
    }
}

// Show login form
function showLoginForm() {
    // Show auth section and hide app content
    const authSection = document.getElementById('auth-section');
    const appContent = document.getElementById('app-content');
    
    if (authSection && appContent) {
        authSection.classList.remove('d-none');
        appContent.classList.add('d-none');
    }
    
    // Ensure login form is visible (not register form)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.classList.add('d-none');
    }
}

// ----- NAVIGATION MODULE -----

// Setup navigation between sections
function setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.add('d-none');
            });
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('d-none');
            }
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Handle login/register toggle
    const showRegisterLink = document.getElementById('show-register');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create register form if it doesn't exist
            if (!document.getElementById('register-form')) {
                createRegisterForm();
            }
            
            // Hide login form
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.parentElement.classList.add('d-none');
            }
            
            // Show register form
            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.classList.remove('d-none');
            }
        });
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Show login form
            showLoginForm();
            
            // Show notification
            showNotification('You have been logged out successfully', 'info');
        });
    }
}

// Create register form
function createRegisterForm() {
    const authCard = document.querySelector('#auth-section .card-body');
    if (!authCard) return;
    
    const registerForm = document.createElement('div');
    registerForm.id = 'register-form';
    registerForm.innerHTML = `
        <h3 class="card-title text-center mb-4">Create Account</h3>
        <form id="register-form-element">
            <div class="mb-3">
                <label for="register-name" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="register-name" required>
            </div>
            <div class="mb-3">
                <label for="register-email" class="form-label">Email</label>
                <input type="email" class="form-control" id="register-email" required>
            </div>
            <div class="mb-3">
                <label for="register-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="register-password" required>
            </div>
            <div class="mb-3">
                <label for="register-confirm-password" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="register-confirm-password" required>
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Create Account</button>
            </div>
        </form>
        <hr>
        <p class="text-center mb-0">
            Already have an account? 
            <a href="#" id="show-login">Login</a>
        </p>
    `;
    
    authCard.appendChild(registerForm);
    
    // Setup register form submission
    const registerFormElement = document.getElementById('register-form-element');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Validate inputs
            if (!name || !email || !password) {
                showNotification('Please fill all required fields', 'danger');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'danger');
                return;
            }
            
            // Create user account (simulation)
            const userData = {
                name: name,
                email: email,
                role: 'user'
            };
            
            // Store in local storage
            localStorage.setItem('authToken', 'demo-token-' + Date.now());
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Show authenticated UI
            showAuthenticatedUI(userData);
            
            // Show success notification
            showNotification('Account created successfully!', 'success');
        });
    }
    
    // Setup show login link
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide register form
            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.classList.add('d-none');
            }
            
            // Show login form
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.parentElement.classList.remove('d-none');
            }
        });
    }
}

// ----- FORM SUBMISSIONS MODULE -----

// Setup form submissions
function setupFormSubmissions() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showNotification('Please enter email and password', 'danger');
                return;
            }
            
            // Create user data (simulation)
            const userData = {
                name: email.split('@')[0],
                email: email,
                role: 'user'
            };
            
            // Store in local storage
            localStorage.setItem('authToken', 'demo-token-' + Date.now());
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Show authenticated UI
            showAuthenticatedUI(userData);
            
            // Show success notification
            showNotification('Logged in successfully!', 'success');
        });
    }
    
    // Goal form
    const saveGoalBtn = document.getElementById('save-goal-btn');
    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', function() {
            const title = document.getElementById('goal-title').value;
            const category = document.getElementById('goal-category').value;
            const target = document.getElementById('goal-target').value;
            const unit = document.getElementById('goal-unit').value || '';
            
            if (!title || !category || !target) {
                showNotification('Please fill all required fields', 'danger');
                return;
            }
            
            // In a real app, this would save to backend
            showNotification(`Goal "${title}" saved successfully!`, 'success');
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addGoalModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form
            document.getElementById('goal-form').reset();
        });
    }
    
    // Medication form
    const saveMedicationBtn = document.getElementById('save-medication-btn');
    if (saveMedicationBtn) {
        saveMedicationBtn.addEventListener('click', function() {
            const name = document.getElementById('med-name').value;
            const dosage = document.getElementById('med-dosage').value;
            const unit = document.getElementById('med-unit').value;
            
            if (!name || !dosage) {
                showNotification('Please fill all required fields', 'danger');
                return;
            }
            
            // In a real app, this would save to backend
            showNotification(`Medication "${name}" saved successfully!`, 'success');
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addMedicationModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form
            document.getElementById('medication-form').reset();
        });
    }
    
    // Add time button for medication
    const addTimeBtn = document.getElementById('add-time-btn');
    if (addTimeBtn) {
        addTimeBtn.addEventListener('click', function() {
            const timeEntry = document.createElement('div');
            timeEntry.className = 'med-time-entry d-flex mb-2';
            timeEntry.innerHTML = `
                <input type="time" class="form-control" required>
                <button type="button" class="btn btn-sm btn-outline-danger ms-2 remove-time-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            const medTimes = document.getElementById('med-times');
            if (medTimes) {
                medTimes.appendChild(timeEntry);
            }
            
            // Add event listener to remove button
            const removeBtn = timeEntry.querySelector('.remove-time-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    timeEntry.remove();
                });
            }
        });
    }
    
    // Remove time buttons for medication
    document.querySelectorAll('.remove-time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.med-time-entry').remove();
        });
    });
    
    // Schedule appointment button
    const scheduleAppointmentBtn = document.getElementById('schedule-appointment-btn');
    if (scheduleAppointmentBtn) {
        scheduleAppointmentBtn.addEventListener('click', function() {
            const provider = document.getElementById('appointment-provider').value;
            const type = document.getElementById('appointment-type').value;
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;
            
            if (!provider || !date || !time) {
                showNotification('Please fill all required fields', 'danger');
                return;
            }
            
            // Get provider name
            let providerName = "Dr. Smith";
            if (provider === 'dr-johnson') {
                providerName = "Dr. Johnson";
            } else if (provider === 'dr-davis') {
                providerName = "Dr. Davis";
            }
            
            // Format date
            const appointmentDate = new Date(date);
            const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // In a real app, this would save to backend
            showNotification(`Appointment scheduled with ${providerName} on ${formattedDate} at ${time}`, 'success');
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form
            document.getElementById('appointment-form').reset();
            
            // Add message to conversation (simulation)
            setTimeout(() => {
                addProviderMessage(`Your appointment on ${formattedDate} at ${time} has been confirmed. Please arrive 15 minutes early to complete any paperwork.`);
            }, 3000);
        });
    }
    
    // Message form
    const messageForm = document.getElementById('message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('input[type="text"]');
            if (!input || !input.value.trim()) {
                return;
            }
            
            // Add user message
            addUserMessage(input.value);
            
            // Clear input
            input.value = '';
            
            // Simulate provider response
            setTimeout(() => {
                const responses = [
                    "Thank you for your message. I'll review your information and follow up if needed.",
                    "I've received your update. Your progress looks good, keep following the treatment plan.",
                    "Thanks for letting me know. Let's discuss this at your next appointment.",
                    "I see your concern. Have you noticed any other symptoms?",
                    "Good to hear from you. Continue monitoring and let me know if anything changes."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addProviderMessage(randomResponse);
            }, 2000);
        });
    }
    
    // Data sharing settings
    const saveDataSharingBtn = document.getElementById('save-sharing-settings');
    if (saveDataSharingBtn) {
        saveDataSharingBtn.addEventListener('click', function() {
            showNotification('Data sharing preferences saved successfully', 'success');
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('dataSharingModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
    
    // Care plan download button
    const downloadCarePlanBtn = document.getElementById('download-care-plan');
    if (downloadCarePlanBtn) {
        downloadCarePlanBtn.addEventListener('click', function() {
            showNotification('Care plan would be downloaded as PDF in a real application', 'info');
        });
    }
}

// Add user message to conversation
function addUserMessage(text) {
    const messagesContainer = document.querySelector('.messages-container');
    if (!messagesContainer) return;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${timeString}</span>
        </div>
    `;
    
    // Add to container
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add provider message to conversation
function addProviderMessage(text) {
    const messagesContainer = document.querySelector('.messages-container');
    if (!messagesContainer) return;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message provider-message typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <p><i>Dr. Smith is typing...</i></p>
        </div>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Wait 1.5 seconds, then replace with actual message
    setTimeout(() => {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message provider-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;
        
        // Replace typing indicator with actual message
        messagesContainer.replaceChild(messageElement, typingIndicator);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

// ----- MODALS MODULE -----

// Setup modals
function setupModals() {
    // Create Care Plan button
    const communicationSection = document.getElementById('communication');
    if (communicationSection) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'd-flex gap-2 mb-3';
        actionsContainer.innerHTML = `
            <button class="btn btn-outline-success" id="show-care-plan">
                <i class="fas fa-clipboard-list"></i> View Care Plan
            </button>
            <button class="btn btn-outline-primary" id="show-data-sharing">
                <i class="fas fa-share-alt"></i> Manage Data Sharing
            </button>
        `;
        
        // Add to beginning of communication section
        communicationSection.insertBefore(actionsContainer, communicationSection.firstChild);
        
        // Add event listeners
        document.getElementById('show-care-plan').addEventListener('click', function() {
            const carePlanModal = new bootstrap.Modal(document.getElementById('carePlanModal'));
            carePlanModal.show();
        });
        
        document.getElementById('show-data-sharing').addEventListener('click', function() {
            const dataSharingModal = new bootstrap.Modal(document.getElementById('dataSharingModal'));
            dataSharingModal.show();
        });
    }
}

// ----- CHARTS MODULE -----

// Initialize all charts
function initializeCharts() {
    initVitalsChart();
    initSleepChart();
    initTrendsChart();
    initGoalsProgressChart();
}

// Vitals Chart
function initVitalsChart() {
    const ctx = document.getElementById('vitals-chart');
    if (!ctx) return;
    
    const timeLabels = ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
    
    const heartRateData = [68, 72, 75, 82, 76, 70];
    const systolicData = [125, 122, 120, 128, 126, 123];
    const diastolicData = [82, 80, 78, 84, 83, 81];
    
    const vitalsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Heart Rate (BPM)',
                    data: heartRateData,
                    borderColor: '#e74a3b',
                    backgroundColor: 'rgba(231, 74, 59, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true
                },
                {
                    label: 'Systolic (mmHg)',
                    data: systolicData,
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true
                },
                {
                    label: 'Diastolic (mmHg)',
                    data: diastolicData,
                    borderColor: '#1cc88a',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        borderDash: [2]
                    }
                }
            }
        }
    });
    
    // Add event listeners for time period buttons
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            updateChartData(vitalsChart, period);
        });
    });
}

// Update chart data based on selected time period
function updateChartData(chart, period) {
    let labels, heartRateData, systolicData, diastolicData;
    
    if (period === 'day') {
        labels = ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
        heartRateData = [68, 72, 75, 82, 76, 70];
        systolicData = [125, 122, 120, 128, 126, 123];
        diastolicData = [82, 80, 78, 84, 83, 81];
    } else if (period === 'week') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        heartRateData = [71, 73, 70, 74, 75, 72, 69];
        systolicData = [124, 125, 120, 122, 126, 123, 121];
        diastolicData = [81, 82, 79, 80, 83, 82, 80];
    } else {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        heartRateData = [72, 71, 73, 70];
        systolicData = [124, 122, 125, 120];
        diastolicData = [81, 80, 82, 79];
    }
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = heartRateData;
    chart.data.datasets[1].data = systolicData;
    chart.data.datasets[2].data = diastolicData;
    chart.update();
}

// Sleep Chart
function initSleepChart() {
    const ctx = document.getElementById('sleep-chart');
    if (!ctx) return;
    
    const data = {
        labels: ['Deep', 'Light', 'REM', 'Awake'],
        datasets: [{
            data: [25, 45, 20, 10],
            backgroundColor: [
                '#4e73df',
                '#1cc88a',
                '#36b9cc',
                '#e74a3b'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.formattedValue;
                            return `${label}: ${value}% (${Math.round(value * 0.08 * 10) / 10} hrs)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Trends Chart
function initTrendsChart() {
    const ctx = document.getElementById('trends-chart');
    if (!ctx) return;
    
    const dates = ['Mar 1', 'Mar 5', 'Mar 10', 'Mar 15', 'Mar 20', 'Mar 25', 'Mar 30'];
    const heartRateData = [72, 73, 70, 75, 72, 71, 69];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Heart Rate (BPM)',
                data: heartRateData,
                borderColor: '#e74a3b',
                backgroundColor: 'rgba(231, 74, 59, 0.1)',
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        borderDash: [2]
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' bpm';
                        }
                    }
                }
            }
        }
    });
    
    // Add event listener for dropdown to change metric
    const trendsDropdown = document.getElementById('trendsDropdown');
    if (trendsDropdown) {
        const dropdownItems = document.querySelectorAll('#trendsDropdown + .dropdown-menu .dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update dropdown button text
                trendsDropdown.textContent = this.textContent;
                
                // Remove active class from all items
                dropdownItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
            });
        });
    }
}

// Goals Progress Chart
function initGoalsProgressChart() {
    const ctx = document.getElementById('goals-progress-chart');
    if (!ctx) return;
    
    const data = {
        labels: ['Steps', 'Blood Pressure', 'Sleep'],
        datasets: [{
            label: 'Current Progress (%)',
            data: [75, 40, 60],
            backgroundColor: [
                '#1cc88a',
                '#f6c23e',
                '#4e73df'
            ],
            borderColor: [
                '#169b70',
                '#dda20a',
                '#2e59d9'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ----- DATA SYNC MODULE -----

// Setup data sync functionality
function setupDataSync() {
    // Create sync button
    const syncButton = document.createElement('button');
    syncButton.id = 'sync-button';
    syncButton.className = 'btn btn-primary position-fixed bottom-0 end-0 m-3';
    syncButton.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Connect Device</span>';
    document.body.appendChild(syncButton);
    
    // Add event listener
    syncButton.addEventListener('click', function() {
        const isConnected = this.classList.contains('connected');
        
        if (isConnected) {
            // Disconnect
            this.classList.remove('connected', 'btn-success');
            this.classList.add('btn-primary');
            this.querySelector('span').textContent = 'Connect Device';
            
            showNotification('Device disconnected', 'info');
            clearInterval(window.dataInterval);
        } else {
            // Connect - show connecting state
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';
            
            // Simulate connection process
            setTimeout(() => {
                this.disabled = false;
                this.classList.remove('btn-primary');
                this.classList.add('btn-success', 'connected');
                this.innerHTML = '<i class="fas fa-check"></i> <span>Connected</span>';
                
                showNotification('Device connected successfully', 'success');
                
                // Start data updates
                startDataUpdates();
            }, 2000);
        }
    });
}

// Start periodic data updates
function startDataUpdates() {
    // Clear any existing interval
    if (window.dataInterval) {
        clearInterval(window.dataInterval);
    }
    
    // Set new interval for updates
    window.dataInterval = setInterval(() => {
        // Update heart rate
        const heartRate = Math.floor(Math.random() * 10) + 65; // 65-75 bpm
        document.getElementById('heart-rate-value').textContent = `${heartRate} BPM`;
        document.getElementById('heart-rate-bar').style.width = `${heartRate / 2}%`;
        
        // Update blood pressure
        const systolic = Math.floor(Math.random() * 10) + 120; // 120-130
        const diastolic = Math.floor(Math.random() * 5) + 78; // 78-83
        document.getElementById('bp-value').textContent = `${systolic}/${diastolic} mmHg`;
        document.getElementById('bp-bar').style.width = `${systolic / 2}%`;
        
        // Update temperature
        const temp = (Math.random() * 0.6 + 98.0).toFixed(1); // 98.0-98.6
        document.getElementById('temp-value').textContent = `${temp} °F`;
        document.getElementById('temp-bar').style.width = `${(parseFloat(temp) - 97) * 100 / 3}%`;
        
        // Update oxygen
        const oxygen = Math.floor(Math.random() * 3) + 96; // 96-99
        document.getElementById('oxygen-value').textContent = `${oxygen}%`;
        document.getElementById('oxygen-bar').style.width = `${oxygen}%`;
        
        // Update last updated time
        document.getElementById('last-updated').textContent = 'Just now';
        
    }, 10000); // Update every 10 seconds
}

// ----- PROVIDER COMMUNICATION MODULE -----

// Setup provider communication
function setupProviderCommunication() {
    // Setup provider selection
    const providerLinks = document.querySelectorAll('.list-group-item-action');
    providerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active class
            providerLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Update header to show selected provider
            const providerName = this.querySelector('h6').textContent;
            const header = document.querySelector('.card-header h5');
            if (header) {
                header.textContent = `Messages with ${providerName}`;
            }
        });
    });
}

// ----- UTILITY FUNCTIONS -----

// Show notification
function showNotification(message, type = 'primary') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-header">
            <span class="bg-${type} rounded me-2" style="width: 20px; height: 20px;"></span>
            <strong class="me-auto">Health Monitor</strong>
            <small>Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 5000
    });
    bsToast.show();
    
    // Remove after hiding
    toast.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// ----- INITIALIZATION -----

// Initialize mock data
function initializeMockData() {
    // Set initial values
    document.getElementById('last-updated').textContent = '5 mins ago';
    
    // Update steps periodically
    setInterval(() => {
        // Get current step count
        const currentStepsEl = document.getElementById('steps-count');
        if (!currentStepsEl) return;
        
        const currentSteps = parseInt(currentStepsEl.textContent.replace(/,/g, ''));
        
        // Add random steps (10-50)
        const newSteps = currentSteps + Math.floor(Math.random() * 40) + 10;
        
        // Update display
        currentStepsEl.textContent = newSteps.toLocaleString();
        
        // Update percentage
        const percentage = Math.min(Math.floor(newSteps / 10000 * 100), 100);
        const percentageEl = document.getElementById('steps-percentage');
        if (percentageEl) {
            percentageEl.textContent = `${percentage}%`;
        }
        
    }, 20000); // Every 20 seconds
}