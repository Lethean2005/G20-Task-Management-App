const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const menuItems = document.querySelectorAll('.sidebar .menu li a');

// Toggle menu collapse/expand
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    // Adjust mainContent width dynamically
    if (sidebar.classList.contains('collapsed')) {
        mainContent.style.width = `calc(100% - 80px)`; 
    } else {
        mainContent.style.width = `calc(100% - 250px)`; 
    }

    // Toggle the icon between list and x (using bi-list and bi-x)
    const icon = menuToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
    } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
    }
});

// Add active class to clicked menu item
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});



// Firebase Configuration
