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


// chang images Auto
// Array of image sources
const images = [
    "images/dashbord-images/book-image.png",
    "images/dashbord-images/book-image2.png",
    "images/dashbord-images/book-image3.png", 
];

// Set the initial index to 0
let currentIndex = 0;

// Function to change the image
function changeImage() {
    // Get the image element
    const imageElement = document.getElementById("imageSlider");
    imageElement.src = images[currentIndex];
    currentIndex = (currentIndex + 1) % images.length;
}
setInterval(changeImage, 3000);



// Auto change images
// Auto Image Slider Script
document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "images/dashbord-images/book-image.png",
        "images/dashbord-images/book1.png",
        "images/dashbord-images/book2.png"
    ];
    let currentIndex = 0;

    const imageElement = document.getElementById("imageSlider");

    // Set a fixed size for the image using JavaScript
    imageElement.style.width = "200px";
    imageElement.style.height = "auto";
    imageElement.style.objectFit = "cover";

    // Preload the images
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Change the image every 3 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        imageElement.src = images[currentIndex];
    }, 3000);
});

// project status 
    // Filter Table by Status
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

    // Remove Row Functionality
    function removeRow(button) {
        const row = button.closest('tr');
        row.remove();
    }

    // Review Row Functionality
    function reviewRow(button) {
        const row = button.closest('tr');
        alert(`Reviewing Task: ${row.cells[1].textContent}`);
    }

  
// store project Api in firebase 
document.addEventListener('DOMContentLoaded', () => {
    // Firebase Database URL (use your own database URL)
    const databaseUrl = 'https://task-management-6c572-default-rtdb.firebaseio.com/projects.json';

    // Fetch data from Firebase
    fetch(databaseUrl)
        .then(response => {
            // Check if the response is okay (status code 200)
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const projectsContainer = document.getElementById('projectsContainer');

            // Check if the data is empty or not in expected format
            if (!data || Object.keys(data).length === 0) {
                console.warn('No projects found in the Firebase database.');
                return; 
            }

            // Loop through the data and create a project card for each project
            for (let projectId in data) {
                if (data.hasOwnProperty(projectId)) {
                    const project = data[projectId];

                    // Create a new project card
                    const projectCard = document.createElement('div');
                    projectCard.classList.add('project-card');

                    // Add project details to the card, ensuring there are fallbacks for missing data
                    projectCard.innerHTML = `
                        <div class="project-title">${project.name || 'NO title'}</div>
                        <p class="project-info">${project.description || 'No description provided.'}</p>
                        <p class="project-info">Category: ${project.category || 'Not specified'}</p>
                        <p class="project-info">Status: ${project.status || 'Not Started'}</p>
                        <p class="project-info">Due Date: ${project.dueDate || 'TBD'}</p>
                        <p class="project-info">Priority: ${project.priority || 'TBD'}</p>
                        <div class="project-actions">
                            <button class="btn btn-review" onclick="reviewTask('${projectId}')">Review Task</button>
                            <button class="btn btn-delete" onclick="deleteTask('${projectId}', this)">Delete Task</button>
                        </div>
                    `;

                    // Append the new card to the projects container
                    projectsContainer.appendChild(projectCard);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

// Function to review the task
function reviewTask(projectId) {
    console.log("Reviewing Task with projectId:", projectId);

    // Redirect to project.html with the projectId as a query parameter
    window.location.href = `project.html?projectId=${projectId}`;

    // Optionally, log or alert the task ID for debugging
    alert(`Reviewing Task with ID: ${projectId}`);
}

// Function to delete the task from Firebase and DOM
function deleteTask(projectId, button) {
    const projectCard = button.closest('.project-card');
    
    if (projectCard) {
        // Firebase Database URL (use your own database URL)
        const databaseUrl = `https://task-management-6c572-default-rtdb.firebaseio.com/projects/${projectId}.json`;

        // Send DELETE request to Firebase to delete the project
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


// Function to review the task with SweetAlert confirmation
function reviewTask(projectId) {
    console.log("Reviewing Task with projectId:", projectId);

    // Show SweetAlert to confirm review action
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be redirected to the project page to review this task.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to project.html with the projectId as a query parameter
            window.location.href = `project.html?projectId=${projectId}`;
        } else {
            // Optionally log or alert if canceled
            console.log('Review action canceled.');
        }
    });
}

// Function to delete the task with SweetAlert confirmation
function deleteTask(projectId, button) {
    const projectCard = button.closest('.project-card');

    // Show SweetAlert to confirm delete action
    Swal.fire({
        title: 'Are you sure?',
        text: "This task will be deleted permanently.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Firebase Database URL for the specific project
            const databaseUrl = `https://task-management-6c572-default-rtdb.firebaseio.com/projects/${projectId}.json`;

            // Send DELETE request to Firebase to delete the project
            fetch(databaseUrl, {
                method: 'DELETE', 
            })
            .then(response => {
                if (response.ok) {
                    console.log(`Project ${projectId} deleted from Firebase.`);
                    projectCard.remove(); // Remove the project card from DOM
                    Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
                } else {
                    console.error('Failed to delete the project from Firebase.');
                    Swal.fire('Error!', 'Something went wrong, try again later.', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting project from Firebase:', error);
                Swal.fire('Error!', 'Something went wrong, try again later.', 'error');
            });
        } else {
            console.log('Delete action canceled.');
        }
    });
}


