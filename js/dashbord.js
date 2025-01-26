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

// Auto change images
document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "images/dashbord-images/book-image.png",
        "images/dashbord-images/book1.png",
        "images/dashbord-images/book2.png"
    ];
    let currentIndex = 0;

    const imageElement = document.getElementById("imageSlider");

    imageElement.style.width = "200px";
    imageElement.style.height = "auto";
    imageElement.style.objectFit = "cover";

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        imageElement.src = images[currentIndex];
    }, 3000);
});

// Project status filter
document.getElementById('filterStatus').addEventListener('change', function () {
    const filterValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('.table-data tbody tr');

    rows.forEach(row => {
        const status = row.cells[2].textContent.trim().toLowerCase(); 
        if (filterValue === '' || status === filterValue) {
            row.style.display = ''; 
        } else {
            row.style.display = 'none'; 
        }
    });
});

// Review Row Functionality with SweetAlert
function reviewRow(button) {
    const row = button.closest('tr');
    const taskName = row.cells[1].textContent;

    // Trigger SweetAlert before redirect
    Swal.fire({
        title: 'Are you sure?',
        text: `You are about to review the task: ${taskName}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Review it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to project.html with the task name or ID
            window.location.href = `project.html?task=${encodeURIComponent(taskName)}`;
        }
    });
}

// Store project API in Firebase
document.addEventListener('DOMContentLoaded', () => {
    const databaseUrl = 'https://task-management-6c572-default-rtdb.firebaseio.com/projects.json';

    fetch(databaseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const projectsContainer = document.getElementById('projectsContainer');
            if (!data || Object.keys(data).length === 0) {
                console.warn('No projects found in the Firebase database.');
                return;
            }

            for (let projectId in data) {
                if (data.hasOwnProperty(projectId)) {
                    const project = data[projectId];

                    const projectCard = document.createElement('div');
                    projectCard.classList.add('project-card');

                    projectCard.innerHTML = `
                        <div class="project-title">${project.name || 'NO title'}</div>
                        <p class="project-info">${project.description || 'No description provided.'}</p>
                        <p class="project-info">Category: ${project.category || 'Not specified'}</p>
                        <p class="project-info">Status: ${project.status || 'Not Started'}</p>
                        <p class="project-info">Due Date: ${project.dueDate || 'TBD'}</p>
                        <p class="project-info">Priority: ${project.priority || 'TBD'}</p>
                        <div class="project-actions">
                            <button class="btn btn-review" onclick="reviewTask('${projectId}')">Review Task</button>
                            <button class="btn btn-delete" onclick="confirmDelete('${projectId}', this)">Delete Task</button>
                        </div>
                    `;

                    projectsContainer.appendChild(projectCard);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

// Function to review the task with SweetAlert
function reviewTask(projectId) {
    Swal.fire({
        title: 'Are you sure?',
        text: `You are about to review the task with ID: ${projectId}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Review it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to project.html with the project ID
            window.location.href = `project.html?projectId=${projectId}`;
        }
    });
}

// Function to show SweetAlert before deleting task
function confirmDelete(projectId, button) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this task!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with task deletion
            deleteTask(projectId, button);
        }
    });
}

// Function to delete the task from Firebase and DOM
function deleteTask(projectId, button) {
    const projectCard = button.closest('.project-card');
    
    if (projectCard) {
        const databaseUrl = `https://task-management-6c572-default-rtdb.firebaseio.com/projects/${projectId}.json`;

        fetch(databaseUrl, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log(`Project ${projectId} deleted from Firebase.`);
                projectCard.remove();
            } else {
                console.error('Failed to delete the project from Firebase.');
            }
        })
        .catch(error => {
            console.error('Error deleting project from Firebase:', error);
        });
    }
}
