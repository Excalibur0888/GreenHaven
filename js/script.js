document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');

    navToggle?.addEventListener('click', () => {
        navLeft.classList.toggle('active');
        navRight.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Slider
    const slider = document.querySelector('.slider-track');
    if (!slider) return;

    const slides = Array.from(slider.children);
    const prevButton = document.querySelector('.slider-btn.prev');
    const nextButton = document.querySelector('.slider-btn.next');
    
    let currentIndex = 0;

    function getVisibleSlides() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateSlider() {
        const slideWidth = slider.clientWidth / getVisibleSlides();
        const offset = -currentIndex * slideWidth;
        slider.style.transform = `translateX(${offset}px)`;
        
        // Обновляем состояние кнопок
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= slides.length - getVisibleSlides();
    }

    // Обработчики кнопок
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextButton.addEventListener('click', () => {
        const visibleSlides = getVisibleSlides();
        if (currentIndex < slides.length - visibleSlides) {
            currentIndex++;
            updateSlider();
        }
    });

    // Обработчик изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const visibleSlides = getVisibleSlides();
            if (currentIndex > slides.length - visibleSlides) {
                currentIndex = Math.max(0, slides.length - visibleSlides);
            }
            updateSlider();
        }, 200);
    });

    // Инициализация слайдера
    updateSlider();
}); 