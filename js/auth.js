// User storage with email verification
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Demo users for testing (remove in production)
const demoUsers = [
    { 
        name: "Demo Student", 
        email: "student@campus.edu", 
        password: "password123", 
        verified: true 
    },
    { 
        name: "Test User", 
        email: "test@test.com", 
        password: "test123", 
        verified: true 
    }
];

// Initialize demo users if not exists
if (registeredUsers.length === 0) {
    registeredUsers.push(...demoUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Find user
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        if (!user.verified) {
            alert('Please verify your email before logging in. Check your inbox for the verification code.');
            return;
        }
        
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        alert('Login successful!');
        window.location.href = 'books.html';
    } else {
        alert('Invalid email or password.');
    }
}

// Handle signup with email verification
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const verificationCode = document.getElementById('verificationCode')?.value;
    
    // Check if user already exists
    if (registeredUsers.find(u => u.email === email)) {
        alert('An account with this email already exists.');
        return;
    }
    
    // Check if we're in verification stage
    if (pendingVerifications[email] && verificationCode) {
        if (pendingVerifications[email].code === verificationCode) {
            // Verification successful
            const newUser = {
                name: pendingVerifications[email].name,
                email: email,
                password: pendingVerifications[email].password,
                verified: true
            };
            
            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            // Clean up pending verification
            delete pendingVerifications[email];
            localStorage.setItem('pendingVerifications', JSON.stringify(pendingVerifications));
            
            // Auto login
            currentUser = { name: newUser.name, email: newUser.email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            alert('Email verified successfully! Your account has been created.');
            window.location.href = 'books.html';
        } else {
            alert('Invalid verification code. Please try again.');
        }
        return;
    }
    
    // Initial signup validation
    if (name && email && password && confirmPassword) {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store pending verification
        pendingVerifications[email] = {
            name: name,
            password: password,
            code: verificationCode,
            timestamp: Date.now()
        };
        
        localStorage.setItem('pendingVerifications', JSON.stringify(pendingVerifications));
        
        // Show verification UI
        document.getElementById('verificationCodeGroup').style.display = 'block';
        document.getElementById('signupButton').textContent = 'Verify Email';
        
        // Simulate sending email (in real app, this would call a backend)
        console.log(`Verification code for ${email}: ${verificationCode}`);
        alert(`Verification code sent to ${email}. Use code: ${verificationCode} (In production, this would be sent via email)`);
        
        // Focus on verification code input
        document.getElementById('verificationCode').focus();
        
    } else {
        alert('Please fill in all fields.');
    }
}

// Resend verification code
function resendVerificationCode() {
    const email = document.getElementById('signupEmail').value;
    
    if (!email) {
        alert('Please enter your email first.');
        return;
    }
    
    if (pendingVerifications[email]) {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        pendingVerifications[email].code = newCode;
        pendingVerifications[email].timestamp = Date.now();
        
        localStorage.setItem('pendingVerifications', JSON.stringify(pendingVerifications));
        
        // Simulate sending email
        console.log(`New verification code for ${email}: ${newCode}`);
        alert(`New verification code sent to ${email}. Use code: ${newCode}`);
    } else {
        alert('No pending verification found for this email.');
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    alert('You have been logged out.');
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Update UI based on authentication state - FIXED VERSION
function updateAuthUI() {
    console.log('Updating auth UI, current user:', currentUser);
    
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    console.log('Found buttons:', { loginBtn, signupBtn, logoutBtn });
    
    if (currentUser) {
        // User is logged in - show logout, hide login/signup
        console.log('User is logged in, updating buttons...');
        if (loginBtn) {
            loginBtn.style.display = 'none';
            console.log('Hid login button');
        }
        if (signupBtn) {
            signupBtn.style.display = 'none';
            console.log('Hid signup button');
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            console.log('Showed logout button');
        }
        
        // Update any user-specific elements
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(element => {
            element.textContent = currentUser.name;
        });
    } else {
        // User is not logged in - show login/signup, hide logout
        console.log('User is not logged in, updating buttons...');
        if (loginBtn) {
            loginBtn.style.display = 'block';
            console.log('Showed login button');
        }
        if (signupBtn) {
            signupBtn.style.display = 'block';
            console.log('Showed signup button');
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
            console.log('Hid logout button');
        }
    }
}

// Check auth and redirect
function checkAuthAndRedirect(page) {
    if (isLoggedIn()) {
        window.location.href = page;
    } else {
        alert('Please login to access this feature.');
        window.location.href = 'login.html';
    }
}

// Clean up expired verifications (24 hours)
function cleanExpiredVerifications() {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    Object.keys(pendingVerifications).forEach(email => {
        if (now - pendingVerifications[email].timestamp > twentyFourHours) {
            delete pendingVerifications[email];
        }
    });
    
    localStorage.setItem('pendingVerifications', JSON.stringify(pendingVerifications));
}

// Initialize auth state when page loads
function initializeAuth() {
    console.log('Initializing auth...');
    // Load current user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('Loaded user from storage:', currentUser);
    } else {
        console.log('No user found in storage');
    }
    updateAuthUI();
}

// Run cleanup and initialization on load
cleanExpiredVerifications();

// Initialize auth state when script loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing auth...');
    initializeAuth();
});