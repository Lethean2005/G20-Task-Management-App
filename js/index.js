document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "/images/background.webp",
        "/images/background1.jpg",
        "/images/background2.jpg"
    ];
    let currentIndex = 0;

    const imageElement = document.getElementById("changingImage");

    // Set a fixed size for the image using JavaScript
    imageElement.style.width = "500px"; 
    imageElement.style.height = "300px"; 
    imageElement.style.objectFit = "cover"; 

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


