const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const nightModeToggle = document.getElementById('nightModeToggle');

// Function to apply dark mode
function applyDarkMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);
    nightModeToggle.checked = isDarkMode;
}

// Function to apply menu state
function applyMenuState(isCollapsed) {
    sidebar.classList.toggle('collapsed', isCollapsed);
    mainContent.classList.toggle('expanded', isCollapsed);

    // Adjust mainContent width dynamically
    if (isCollapsed) {
        mainContent.style.width = `calc(100% - 80px)`;
    } else {
        mainContent.style.width = `calc(100% - 250px)`;
    }

    // Toggle the icon between list and x (using bi-list and bi-x)
    const icon = menuToggle.querySelector('i');
    if (isCollapsed) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
    } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
    }
}

// Function to save profile to local storage
function saveProfileToStorage(name, email, bio, imageSrc) {
    const profile = { name, email, bio, imageSrc };
    localStorage.setItem('profile', JSON.stringify(profile));
}

// Function to load profile from local storage
function loadProfileFromStorage() {
    const profile = JSON.parse(localStorage.getItem('profile')) || {
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'A short bio about the user.',
        imageSrc: '' // If no image exists, set to an empty string
    };

    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileBio').textContent = profile.bio;
    document.getElementById('profileImg').src = profile.imageSrc || 'default-profile.jpg'; // Set default image if none exists
}

// Initialize settings from local storage
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    const isMenuCollapsed = JSON.parse(localStorage.getItem('menuCollapsed')) || false;

    applyDarkMode(isDarkMode);
    applyMenuState(isMenuCollapsed);
    loadProfileFromStorage();

    // Add event listener for dark mode toggle
    nightModeToggle.addEventListener('change', () => {
        const isChecked = nightModeToggle.checked;
        localStorage.setItem('darkMode', isChecked);
        applyDarkMode(isChecked);
    });

    // Add event listener for menu toggle
    menuToggle.addEventListener('click', () => {
        const isCollapsed = !sidebar.classList.contains('collapsed');
        localStorage.setItem('menuCollapsed', isCollapsed);
        applyMenuState(isCollapsed);
    });
});

// Edit Profile Function
function editProfile() {
    const name = document.getElementById('profileName');
    const email = document.getElementById('profileEmail');
    const bio = document.getElementById('profileBio');

    // Replace profile info with input fields
    name.innerHTML = `<input type="text" id="editName" value="${name.textContent.trim()}">`;
    email.innerHTML = `<input type="email" id="editEmail" value="${email.textContent.trim()}">`;
    bio.innerHTML = `<textarea id="editBio">${bio.textContent.trim()}</textarea>`;

    // Change the Edit button to Save button
    const button = document.querySelector('.edit-button');
    button.innerHTML = 'Save Changes';
    button.setAttribute('onclick', 'saveProfile()');
}

// Save Profile Function
function saveProfile() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const bio = document.getElementById('editBio').value;
    const imageSrc = document.getElementById('profileImg').src; // Get image source

    // Update the displayed profile info
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileBio').textContent = bio;

    // Save to local storage
    saveProfileToStorage(name, email, bio, imageSrc);

    // Change the button back to Edit
    const button = document.querySelector('.edit-button');
    button.innerHTML = 'Edit Profile';
    button.setAttribute('onclick', 'editProfile()');

    alert('Profile updated and saved!');
}

// Preview Profile Picture
function previewProfilePicture(event) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById('profileImg').src = reader.result;
        // Save the new image to localStorage
        const name = document.getElementById('profileName').textContent;
        const email = document.getElementById('profileEmail').textContent;
        const bio = document.getElementById('profileBio').textContent;
        saveProfileToStorage(name, email, bio, reader.result); // Save image in localStorage
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Logout Function
function logout() {
    alert('You have been logged out.');
    window.location.href = 'form.html';
}
