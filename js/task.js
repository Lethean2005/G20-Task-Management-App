const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const menuItems = document.querySelectorAll('.sidebar .menu li a');

        // Toggle menu collapse/expand
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
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


// ------------------------------------------

// Import Firebase functions correctly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// Reference to the "tasks" node in Firebase
const tasksRef = ref(database, "tasks"); // Define tasksRef here

// DOM Elements
const addTaskModal = document.getElementById("addTaskModal");
const closeModal = document.querySelector(".close");
const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskForm = document.getElementById("addTaskForm");
const taskTableBody = document.getElementById("taskTableBody");

// Open Add Task Modal
addTaskBtn.addEventListener("click", () => {
  addTaskModal.style.display = "flex";
});

// Close Add Task Modal
closeModal.addEventListener("click", () => {
  addTaskModal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === addTaskModal) {
    addTaskModal.style.display = "none";
  }
});

// Fetch data and populate the table
onValue(tasksRef, (snapshot) => {
  const tasks = snapshot.val();
  taskTableBody.innerHTML = ""; // Clear existing rows

  if (!tasks) {
    console.log("No tasks found in the database.");
    return;
  }

  for (const taskId in tasks) {
    const task = tasks[taskId];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.name || "No Name"}</td>
      <td>${task.dueDate || "No Due Date"}</td>
      <td><span class="task-priority ${task.priority?.toLowerCase() || "medium"}">${task.priority || "Medium Priority"}</span></td>
      <td><span class="task-status ${task.category?.toLowerCase().replace(" ", "-") || "to-do"}">${task.category || "To Do"}</span></td>
    `;
    taskTableBody.appendChild(row);
  }
}, (error) => {
  console.error("Error fetching data:", error);
});

// Handle Add Task Form Submission
addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("taskName").value;
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.getElementById("taskPriority").value;
  const category = document.getElementById("taskCategory").value;

  // Push the new task to Firebase
  push(tasksRef, {
    name,
    dueDate,
    priority,
    category
  });

  // Clear the form and close the modal
  addTaskForm.reset();
  addTaskModal.style.display = "none";
});