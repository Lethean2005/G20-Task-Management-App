const initializeCharts = (labels, progressData) => {
    // Initialize Shipment Chart
    const shipmentCtx = document.getElementById('shipmentChart').getContext('2d');
    const shipmentChart = new Chart(shipmentCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Project Progress',
                    data: progressData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100, // Assuming progress is a percentage
                },
            },
        },
    });

    // Initialize Revenue Chart (Example)
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Project Status',
                    data: progressData, // Use progress or another metric
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    // Initialize Expenses Chart (Example)
    const expensesCtx = document.getElementById('expensesChart').getContext('2d');
    const expensesChart = new Chart(expensesCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Project Distribution',
                    data: progressData, // Use progress or another metric
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
        },
    });
};
const updateCharts = (timeFrame, labels, progressData) => {
    // Filter data based on the selected time frame
    const filteredData = filterDataByTimeFrame(timeFrame, progressData);

    // Update charts with filtered data
    shipmentChart.data.datasets[0].data = filteredData;
    revenueChart.data.datasets[0].data = filteredData;
    expensesChart.data.datasets[0].data = filteredData;
    shipmentChart.update();
    revenueChart.update();
    expensesChart.update();
};

// Add event listeners to time frame buttons
const buttons = document.querySelectorAll('.chart-buttons button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const timeFrame = button.textContent.toLowerCase();
        updateCharts(timeFrame, labels, progressData);
    });
});

// Call the function to initialize charts
initializeCharts();
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
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.card');
        
            cards.forEach(card => {
                card.addEventListener('click', function() {
                    const title = card.getAttribute('data-title');
                    const percent = card.getAttribute('data-percent');
        
                    Swal.fire({
                        title: title,
                        text: `This card represents ${percent} of the total.`,
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                });
            });
        });
// Initialize All Functions
const initializeApp = () => {
    initializeChart();
    initializeSubscriptionAlert();
    initializeNavigationHover();
    initializeMenuToggle();
};

// Run the App
document.addEventListener('DOMContentLoaded', initializeApp);
