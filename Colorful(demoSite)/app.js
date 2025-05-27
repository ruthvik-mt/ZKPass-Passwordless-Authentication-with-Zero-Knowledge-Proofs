document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.querySelector('.auth-container');
    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');
    const registerBtn = document.getElementById('register-btn');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const statusMessage = document.getElementById('status-message');
    const container = document.querySelector('.container');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('colorful_current_user');
    if (currentUser) {
        showColorsPage(JSON.parse(currentUser).username);
    }
    
    // Handle register button click
    registerBtn.addEventListener('click', handleRegister);
    
    // Handle login button click
    loginBtn.addEventListener('click', handleLogin);
    
    // Handle Enter key press for register
    registerPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    });
    
    // Handle Enter key press for login
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    function handleRegister() {
        const username = registerUsername.value.trim();
        const password = registerPassword.value.trim();
        
        if (!username || !password) {
            showStatus('Please enter both username and password', 'error');
            return;
        }
        
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('colorful_users') || '[]');
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showStatus('Username already exists', 'error');
            return;
        }
        
        // Simulate API call with timeout
        showStatus('Processing registration...', 'info');
        
        setTimeout(() => {
            // Add new user to localStorage
            users.push({ username, password });
            localStorage.setItem('colorful_users', JSON.stringify(users));
            
            // Clear registration form
            registerUsername.value = '';
            registerPassword.value = '';
            
            showStatus('Registration successful! Please login.', 'success');
        }, 1000);
    }
    
    function handleLogin() {
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();
        
        if (!username || !password) {
            showStatus('Please enter both username and password', 'error');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('colorful_users') || '[]');
        
        // Find user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            showStatus('Invalid username or password', 'error');
            return;
        }
        
        // Simulate API call with timeout
        showStatus('Logging in...', 'info');
        
        setTimeout(() => {
            // Store current user in localStorage
            localStorage.setItem('colorful_current_user', JSON.stringify(user));
            showStatus('Login successful! Redirecting...', 'success');
            
            // Show colors page after short delay
            setTimeout(() => {
                showColorsPage(username);
            }, 500);
        }, 1000);
    }
    
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type || '';
    }
    
    function showColorsPage(username) {
        // Hide login container
        loginContainer.style.display = 'none';
        
        // Create colors container if it doesn't exist
        let colorsContainer = document.querySelector('.colors-container');
        if (!colorsContainer) {
            colorsContainer = document.createElement('div');
            colorsContainer.className = 'colors-container';
            document.body.appendChild(colorsContainer);
            
            // Create user info display
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <span>Welcome, ${username}!</span>
                <button class="logout-btn">Logout</button>
            `;
            document.body.appendChild(userInfo);
            
            // Add logout functionality
            const logoutBtn = userInfo.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('colorful_current_user');
                colorsContainer.remove();
                userInfo.remove();
                loginContainer.style.display = 'block';
                usernameInput.value = '';
                showStatus('', '');
                // Reset background
                document.body.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
            });
            
            // Generate color boxes
            generateColorBoxes(colorsContainer);
        }
        
        // Show colors container and user info
        colorsContainer.style.display = 'flex';
        document.querySelector('.user-info').style.display = 'block';
    }
    
    function generateColorBoxes(container) {
        // Array of vibrant colors
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', 
            '#FF006E', '#8338EC', '#3A86FF', '#38B000', '#9D4EDD',
            '#F72585', '#7209B7', '#3F37C9', '#4CC9F0', '#4361EE',
            '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4', '#9B5DE5',
            '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4', '#9B5DE5',
            '#FF9770', '#FFD670', '#E9FF70', '#70D6FF', '#FF70A6'
        ];
        
        // Create color boxes
        for (let i = 0; i < 30; i++) {
            const colorBox = document.createElement('div');
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = randomColor;
            colorBox.textContent = randomColor;
            
            // Add click interaction
            colorBox.addEventListener('click', () => {
                // Change background color on click
                document.body.style.background = randomColor;
                
                // Add animation effect
                colorBox.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    colorBox.style.transform = 'scale(1)';
                }, 300);
            });
            
            container.appendChild(colorBox);
        }
    }
});

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (isLoggedIn && (currentPage.includes('index.html') || currentPage.includes('login.html') || currentPage.includes('recover.html'))) {
        window.location.href = 'dashboard.html';
    } else if (!isLoggedIn && currentPage.includes('dashboard.html')) {
        window.location.href = 'login.html';
    }
}

// Handle registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const uid = document.getElementById('uid').value;

        // Store user data (in a real app, this would be handled by a backend)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.uid === uid);

        if (userExists) {
            alert('UID already exists!');
            return;
        }

        users.push({ uid });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// Handle login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const uid = document.getElementById('uid').value;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.uid === uid);

        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', uid);
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid UID!');
        }
    });
}

// Handle recovery
const recoverForm = document.getElementById('recoverForm');
if (recoverForm) {
    recoverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recoveryPhrase = document.getElementById('recoveryPhrase').value;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.recoveryPhrase === recoveryPhrase);

        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', user.uid);
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid recovery phrase!');
        }
    });
}

// Dashboard functionality
const dashboardInput = document.getElementById('dashboardInput');
const submitBtn = document.getElementById('submitBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (dashboardInput && submitBtn) {
    submitBtn.addEventListener('click', () => {
        const message = dashboardInput.value.trim();
        if (message) {
            alert(`Message submitted: ${message}`);
            dashboardInput.value = '';
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

// Add hover effects to color boxes
const colorBoxes = document.querySelectorAll('.color-box');
colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        const color = box.style.backgroundColor;
        alert(`Selected color: ${color}`);
    });
});

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth);