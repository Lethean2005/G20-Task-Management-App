
// Sidebar toggle
const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const menuItems = document.querySelectorAll('.sidebar .menu li a');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.remove('bi-list');
                icon.classList.add('bi-x');
            } else {
                icon.classList.remove('bi-x');
                icon.classList.add('bi-list');
            }
        });

        
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });



// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get, push, remove, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX-sHpuS0og69TgIwe3JzQlIdKEbaNGXU",
  authDomain: "task-management-6c572.firebaseapp.com",
  databaseURL: "https://task-management-6c572-default-rtdb.firebaseio.com",
  projectId: "task-management-6c572",
  storageBucket: "task-management-6c572.firebasestorage.app",
  messagingSenderId: "384210904544",
  appId: "1:384210904544:web:e6c6ac10efcee8ccb77785"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// DOM elements
const projectInput = document.getElementById("projectInput");
const projectDescription = document.getElementById("projectDescription");
const projectCategory = document.getElementById("projectCategory");
const projectStatus = document.getElementById("projectStatus");
const projectDueDate = document.getElementById("projectDueDate");
const projectPriority = document.getElementById("projectPriority");
const projectList = document.getElementById("projectList");
const taskSection = document.getElementById("taskSection");
const selectedProjectName = document.getElementById("selectedProjectName");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const todoList = document.getElementById("todoList");
const inProgressList = document.getElementById("inProgressList");
const stuckList = document.getElementById("stuckList");
const completeList = document.getElementById("completeList");
const backToProjects = document.getElementById("backToProjects");
const searchInput = document.getElementById("searchInput");
const projectSection = document.getElementById("projectSection");
const createProjectButton = document.getElementById("createProjectButton");
const projectForm = document.getElementById("projectForm");
const cancelProjectForm = document.getElementById("cancelProjectForm");


let projects = []; 
let selectedProjectId = null;


// Render projects
function renderProjects() {
  projectList.innerHTML = "";
  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "col-md-4 mb-4";
    projectCard.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${project.name}</h5>
          <p class="card-text">${project.description || "No description provided."}</p>
          <p class="card-text"><strong>Category:</strong> ${project.category}</p>
          <p class="card-text"><strong>Status:</strong> ${project.status}</p>
          <p class="card-text"><strong>Due Date:</strong> ${project.dueDate}</p>
          <p class="card-text"><strong>Priority:</strong> ${project.priority}</p>
          <div class="progress mb-3">
            <div class="progress-bar" role="progressbar" style="width: ${project.progress || 0}%;" aria-valuenow="${project.progress || 0}" aria-valuemin="0" aria-valuemax="100">${project.progress || 0}%</div>
          </div>
          <button class="btn btn-primary" onclick="viewTasks('${project.id}')">View Tasks</button>
          <button class="btn btn-warning" onclick="editProject('${project.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
        </div>
      </div>
    `;
    projectList.appendChild(projectCard);
  });
}


// Save project event listener
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const project = {
    name: projectInput.value.trim(),
    description: projectDescription.value.trim(),
    category: projectCategory.value,
    status: projectStatus.value,
    dueDate: projectDueDate.value,
    priority: projectPriority.value,
    progress: 0,
    tasks: []
  };
  console.log("Form submitted with data:", project); // Debugging
  saveProject(project);
  projectForm.reset();
  projectForm.style.display = "none";
  createProjectButton.style.display = "block";
});


// Save project to Firebase
function saveProject(project) {
  console.log("Saving project:", project); // Debugging
  const projectRef = ref(database, `projects/${project.id || push(ref(database, 'projects')).key}`);
  set(projectRef, project)
    .then(() => {
      console.log("Project saved to Firebase!");
      loadProjects();
    })
    .catch((error) => {
      console.error("Error saving project:", error);
    });
}


// Show the form when "Create Project" button is clicked
createProjectButton.addEventListener("click", () => {
  projectForm.style.display = "block";
  createProjectButton.style.display = "none";
});


// Hide the form when "Cancel" button is clicked
cancelProjectForm.addEventListener("click", () => {
  projectForm.style.display = "none";
  createProjectButton.style.display = "block";
  projectForm.reset();
});


// Load projects from Firebase
function loadProjects() {
  const projectsRef = ref(database, 'projects');
  get(projectsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        projects = Object.entries(snapshot.val()).map(([id, project]) => ({ id, ...project }));
        renderProjects();
      } else {
        console.log("No projects found in Firebase.");
      }
    })
    .catch((error) => {
      console.error("Error loading projects:", error);
    });
}


// Edit a project
window.editProject = function (projectId) {
  const projectRef = ref(database, `projects/${projectId}`);

  // Fetch the project data from Firebase
  get(projectRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const project = snapshot.val();

        // Show the edit project modal
        Swal.fire({
          title: "Edit Project",
          html: `
            <input type="text" id="editProjectName" class="swal2-input" value="${project.name}" placeholder="Project Name" required>
            <textarea id="editProjectDescription" class="swal2-textarea" placeholder="Project Description">${project.description || ""}</textarea>
            <select id="editProjectCategory" class="swal2-select">
              <option value="Personal" ${project.category === "Personal" ? "selected" : ""}>Personal</option>
              <option value="Work" ${project.category === "Work" ? "selected" : ""}>Work</option>
              <option value="Study" ${project.category === "Study" ? "selected" : ""}>Study</option>
              <option value="Other" ${project.category === "Other" ? "selected" : ""}>Other</option>
            </select>
            <select id="editProjectStatus" class="swal2-select">
              <option value="Not Started" ${project.status === "Not Started" ? "selected" : ""}>Not Started</option>
              <option value="In Progress" ${project.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Completed" ${project.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
            <input type="date" id="editProjectDueDate" class="swal2-input" value="${project.dueDate}" required>
            <select id="editProjectPriority" class="swal2-select">
              <option value="Low" ${project.priority === "Low" ? "selected" : ""}>Low</option>
              <option value="Medium" ${project.priority === "Medium" ? "selected" : ""}>Medium</option>
              <option value="High" ${project.priority === "High" ? "selected" : ""}>High</option>
            </select>
          `,
          showCancelButton: true,
          confirmButtonText: "Save",
          preConfirm: () => {
            const name = Swal.getPopup().querySelector("#editProjectName").value.trim();
            const description = Swal.getPopup().querySelector("#editProjectDescription").value.trim();
            const category = Swal.getPopup().querySelector("#editProjectCategory").value;
            const status = Swal.getPopup().querySelector("#editProjectStatus").value;
            const dueDate = Swal.getPopup().querySelector("#editProjectDueDate").value;
            const priority = Swal.getPopup().querySelector("#editProjectPriority").value;

            if (!name || !category || !status || !dueDate || !priority) {
              Swal.showValidationMessage("Please fill in all fields.");
              return;
            }

            return { name, description, category, status, dueDate, priority };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { name, description, category, status, dueDate, priority } = result.value;

            // Update the project in Firebase
            update(projectRef, { name, description, category, status, dueDate, priority })
              .then(() => {
                console.log("Project updated successfully in Firebase.");
                // Reload the project list
                loadProjects();

                // Notify the user
                Swal.fire("Updated!", "Project has been updated.", "success");
              })
              .catch((error) => {
                console.error("Error updating project in Firebase:", error);
                Swal.fire("Error", "Failed to update project.", "error");
              });
          }
        });
      } else {
        console.error("Project not found in Firebase.");
        Swal.fire("Error", "Project not found.", "error");
      }
    })
    .catch((error) => {
      console.error("Error loading project from Firebase:", error);
      Swal.fire("Error", "Failed to load project.", "error");
    });
};


// Delete project
window.deleteProject = function (projectId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const projectRef = ref(database, `projects/${projectId}`);
      remove(projectRef)
        .then(() => {
          Swal.fire(
            'Deleted!',
            'Your project has been deleted.',
            'success'
          );
          loadProjects(); 
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
          Swal.fire(
            'Error!',
            'Failed to delete project.',
            'error'
          );
        });
    }
  });
};



// View tasks for a project
window.viewTasks = function (projectId) {
  console.log("viewTasks called with projectId:", projectId); 
  const project = projects.find((p) => p.id === projectId);
  if (project) {
      selectedProjectName.textContent = project.name;
      projectSection.style.display = "none";
      taskSection.style.display = "block";
      taskForm.style.display = "none"; 
      loadTasks(projectId);
  } else {
      console.error("Project not found with ID:", projectId);
  }
};


// Toggle Task Form Visibility
document.getElementById("toggleTaskFormButton").addEventListener("click", function () {
  const taskForm = document.getElementById("taskForm");
  if (taskForm.style.display === "none") {
      taskForm.style.display = "block"; // Show the form
  } else {
      taskForm.style.display = "none"; // Hide the form
  }
});


// Load tasks for the selected project
function loadTasks(projectId) {
  const tasksRef = ref(database, `projects/${projectId}/tasks`);
  get(tasksRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tasks = Object.entries(snapshot.val()).map(([id, task]) => ({ id, ...task }));
        renderTasks(tasks);
      } else {
        console.log("No tasks found.");
      }
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
    });
}

// Render tasks
function renderTasks(tasks) {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  stuckList.innerHTML = "";
  completeList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = `list-group-item priority-${task.priority.toLowerCase()}`;
    taskItem.innerHTML = `
      <span class="${task.category === 'Complete' ? 'completed' : ''}">${task.name} - Due: ${task.dueDate || "No due date"}</span>
      <div class="task-actions">
        <button class="btn btn-warning btn-sm" onclick="editTask('${selectedProjectId}', '${task.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTask('${selectedProjectId}', '${task.id}')">Delete</button>
      </div>
    `;

    if (task.category === "Todo") {
      todoList.appendChild(taskItem);
    } else if (task.category === "In Progress") {
      inProgressList.appendChild(taskItem);
    } else if (task.category === "Stuck") {
      stuckList.appendChild(taskItem);
    } else if (task.category === "Complete") {
      completeList.appendChild(taskItem);
    }
  });
}


// Add task event listener
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
      name: taskInput.value.trim(),
      category: categoryInput.value,
      priority: priorityInput.value,
      dueDate: dueDateInput.value
  };
  saveTask(selectedProjectId, task);
  taskForm.reset();
  taskForm.style.display = "none"; 
});


// Cancel Task Form
document.getElementById("cancelTaskForm").addEventListener("click", function () {
  taskForm.style.display = "none"; 
  taskForm.reset(); 
});


/// Save task to Firebase
function saveTask(projectId, task) {
  const taskRef = ref(database, `projects/${projectId}/tasks/${task.id || push(ref(database, `projects/${projectId}/tasks`)).key}`);
  set(taskRef, task)
      .then(() => {
          Swal.fire(
              'Success!',
              'Task saved successfully!',
              'success'
          );
          loadTasks(projectId); 
      })
      .catch((error) => {
          console.error("Error saving task:", error);
          Swal.fire(
              'Error!',
              'Failed to save task.',
              'error'
          );
      });
}


// Search tasks
document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.trim().toLowerCase(); 
  filterTasks(searchTerm); 
});


// Function to filter tasks
function filterTasks(searchTerm) {
  const allTasks = document.querySelectorAll(".list-group-item"); 

  allTasks.forEach((task) => {
      const taskName = task.querySelector("span").textContent.toLowerCase(); 
      if (taskName.includes(searchTerm)) {
          task.style.display = "block"; 
      } else {
          task.style.display = "none"; 
      }
  });
}


// Edit task
window.editTask = function editTask(projectId, taskId) {
  const taskRef = ref(database, `projects/${projectId}/tasks/${taskId}`);
  get(taskRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const task = snapshot.val();
        Swal.fire({
          title: "Edit Task",
          html: `
            <input type="text" id="editTaskName" class="swal2-input" value="${task.name}" placeholder="Task Name">
            <select id="editTaskCategory" class="swal2-select">
              <option value="Todo" ${task.category === "Todo" ? "selected" : ""}>Todo</option>
              <option value="In Progress" ${task.category === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Stuck" ${task.category === "Stuck" ? "selected" : ""}>Stuck</option>
              <option value="Complete" ${task.category === "Complete" ? "selected" : ""}>Complete</option>
            </select>
            <select id="editTaskPriority" class="swal2-select">
              <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
              <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
              <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
            </select>
            <input type="date" id="editTaskDueDate" class="swal2-input" value="${task.dueDate || ""}">
          `,
          showCancelButton: true,
          confirmButtonText: "Save",
          preConfirm: () => {
            const name = Swal.getPopup().querySelector("#editTaskName").value.trim();
            const category = Swal.getPopup().querySelector("#editTaskCategory").value;
            const priority = Swal.getPopup().querySelector("#editTaskPriority").value;
            const dueDate = Swal.getPopup().querySelector("#editTaskDueDate").value;
            if (!name) {
              Swal.showValidationMessage("Task name cannot be empty");
            }
            return { name, category, priority, dueDate };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const { name, category, priority, dueDate } = result.value;
            update(taskRef, { name, category, priority, dueDate })
              .then(() => {
                console.log("Task updated successfully!");
                loadTasks(projectId); 
              })
              .catch((error) => {
                console.error("Error updating task:", error);
              });
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error loading task:", error);
    });
}


// Delete task
window.deleteTask = function (projectId, taskId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const taskRef = ref(database, `projects/${projectId}/tasks/${taskId}`);
      remove(taskRef)
        .then(() => {
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          );
          loadTasks(projectId); 
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          Swal.fire(
            'Error!',
            'Failed to delete task.',
            'error'
          );
        });
    }
  });
};



// Go back to projects
backToProjects.addEventListener("click", () => {
  projectSection.style.display = "block"; 
  taskSection.style.display = "none"; 
  projectForm.style.display = "none"; 
  createProjectButton.style.display = "block"; 
});


// Load projects on page load
window.addEventListener("load", () => {
  loadProjects();
});