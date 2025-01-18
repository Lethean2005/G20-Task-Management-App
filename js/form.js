document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const formOverlay = document.getElementById('formOverlay');
    const formContainer = document.getElementById('formContainer');

    // Function to show the signup form
    window.showForm = function() {
        formOverlay.style.display = 'block';
        formContainer.style.display = 'block';
    };

    // Function to hide the signup form
    window.hideForm = function() {
        formOverlay.style.display = 'none';
        formContainer.style.display = 'none';
    };

    // Handle signup form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form's default behavior initially
    
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
    
        // Validate input
        if (!firstName || !lastName || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }
    
        // Check if user already exists
        if (localStorage.getItem(email)) {
            alert('User already exists with this email. Please sign in.');
            event.preventDefault();
        }
    
        // Store user data in local storage
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password // Note: In production, never store plain-text passwords.
        };
    
        // Save to local storage using email as the key
        localStorage.setItem(email, JSON.stringify(userData));
    
        // Show success alert
        alert('Signup successful! Please sign in again.');
    
        // Allow the form to refresh by not preventing the default behavior anymore
        signupForm.submit(); 
    
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // Validate input
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem(email);

    // Parse the user data directly (assumes user data exists)
    const userData = storedUserData ? JSON.parse(storedUserData) : null;

    if (!userData) {
        // Handle case where user data doesn't exist
        alert('User not found. Please sign up first.');
        return;
    }

    // Verify password
    if (userData.password !== password) {
        alert('Incorrect password. Please try again.');
        return;
    }

    // Redirect to your website upon successful login
    alert(`Welcome back, ${userData.firstName}! Redirecting to the website...`);
    location.href = 'dashboard.html'; 
    });
});