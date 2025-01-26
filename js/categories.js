const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const menuItems = document.querySelectorAll('.sidebar .menu li a');

// Toggle menu collapse/expand
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

// Add active class to clicked menu item
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Add category functionality
document.getElementById('add-category-btn').addEventListener('click', function () {
    const newCategoryInput = document.getElementById('new-category');
    const newCategory = newCategoryInput.value.trim();

    if (newCategory) {
        const categoriesList = document.getElementById('categories-list');
        const newCategoryItem = document.createElement('li');
        newCategoryItem.innerHTML = `
            <span>${newCategory}</span>
            <div class="category-actions">
                <button class="edit-category-btn"><i class="bi bi-pencil"></i></button>
                <button class="delete-category-btn"><i class="bi bi-trash"></i></button>
            </div>
        `;
        categoriesList.appendChild(newCategoryItem);
        newCategoryInput.value = '';
        Swal.fire({
            icon: 'success',
            title: 'Category Added',
            text: `"${newCategory}" has been added to your categories.`,
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a category name.',
            confirmButtonText: 'OK'
        });
    }
});

// Edit category functionality
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-category-btn')) {
        const categoryItem = event.target.closest('li');
        const categoryText = categoryItem.querySelector('span').textContent;
        Swal.fire({
            title: 'Edit Category',
            input: 'text',
            inputValue: categoryText,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed && result.value.trim()) {
                categoryItem.querySelector('span').textContent = result.value.trim();
                Swal.fire({
                    icon: 'success',
                    title: 'Category Updated',
                    text: 'Your category has been updated.',
                    confirmButtonText: 'OK'
                });
            }
        });
    }
});

// Delete category functionality
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-category-btn')) {
        const categoryItem = event.target.closest('li');
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this category!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                categoryItem.remove();
                Swal.fire({
                    icon: 'success',
                    title: 'Category Deleted',
                    text: 'Your category has been deleted.',
                    confirmButtonText: 'OK'
                });
            }
        });
    }
});

// Firebase Configuration
const firebaseConfig = {
    databaseURL: "https://task-management-f901b-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Reference to the categories list in Firebase
const categoriesRef = database.ref('categories/');

// DOM Elements
const categoriesList = document.getElementById('categories-list');
const newCategoryInput = document.getElementById('new-category');
const addCategoryBtn = document.getElementById('add-category-btn');

// Load categories from Firebase on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

// Function to load categories from Firebase
function loadCategories() {
    categoriesRef.on('value', (snapshot) => {
        categoriesList.innerHTML = ''; // Clear the list before loading
        const categories = snapshot.val();

        if (categories) {
            Object.keys(categories).forEach((key) => {
                const category = categories[key];
                addCategoryToDOM(category.name, key);
            });
        }
    });
}

// Function to add a category to the DOM
function addCategoryToDOM(name, key) {
    const li = document.createElement('li');
    li.setAttribute('data-key', key); // Store Firebase key as a data attribute
    li.innerHTML = `
        <span>${name}</span>
        <div class="category-actions">
            <button class="edit-category-btn"><i class="bi bi-pencil"></i></button>
            <button class="delete-category-btn"><i class="bi bi-trash"></i></button>
        </div>
    `;
    categoriesList.appendChild(li);

    // Add event listeners for edit and delete buttons
    const editBtn = li.querySelector('.edit-category-btn');
    const deleteBtn = li.querySelector('.delete-category-btn');

    editBtn.addEventListener('click', () => editCategory(key, name));
    deleteBtn.addEventListener('click', () => deleteCategory(key));
}

// Function to add a new category
addCategoryBtn.addEventListener('click', () => {
    const categoryName = newCategoryInput.value.trim();

    if (categoryName) {
        // Push new category to Firebase
        const newCategoryRef = categoriesRef.push();
        newCategoryRef.set({ name: categoryName })
            .then(() => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Category added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                newCategoryInput.value = ''; // Clear the input field
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add category. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error('Error adding category:', error);
            });
    } else {
        Swal.fire({
            title: 'Warning!',
            text: 'Please enter a category name.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
});

// Function to edit a category
function editCategory(key, currentName) {
    Swal.fire({
        title: 'Edit Category',
        input: 'text',
        inputValue: currentName,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value.trim()) {
                return 'Please enter a category name.';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updatedName = result.value.trim();

            // Update the category in Firebase
            categoriesRef.child(key).update({ name: updatedName })
                .then(() => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Category updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to update category. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    console.error('Error updating category:', error);
                });
        }
    });
}

// Function to delete a category
function deleteCategory(key) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this category!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove the category from Firebase
            categoriesRef.child(key).remove()
                .then(() => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Category has been deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete category. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    console.error('Error deleting category:', error);
                });
        }
    });
}
