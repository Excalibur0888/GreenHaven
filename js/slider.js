document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const navToggle = document.querySelector('.nav-toggle');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLeft.classList.toggle('active');
            navRight.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Slider functionality
    const slider = document.querySelector('.slider-track');
    if (!slider) return;

    const slides = Array.from(slider.children);
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');

    let currentIndex = 0;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationID = 0;
    let currentSlide = 0;

    // Set initial state
    function initSlider() {
        const slideWidth = slides[0].offsetWidth;
        slides.forEach((slide, index) => {
            slide.style.transition = 'none';
            slide.style.transform = `translateX(${index * slideWidth}px)`;
        });
        updateSliderState();
    }

    // Get number of slides to show based on window width
    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    // Update slider position and state
    function updateSliderState() {
        const slideWidth = slides[0].offsetWidth;
        const slidesPerView = getSlidesPerView();
        const maxIndex = slides.length - slidesPerView;

        // Update current translate
        currentTranslate = -currentIndex * slideWidth;
        prevTranslate = currentTranslate;
        
        // Update slider position with animation
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(${currentTranslate}px)`;

        // Update active slides
        slides.forEach((slide, index) => {
            if (index >= currentIndex && index < currentIndex + slidesPerView) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update buttons state
        if (prevButton) prevButton.disabled = currentIndex === 0;
        if (nextButton) nextButton.disabled = currentIndex === maxIndex;
    }

    // Event Listeners for buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderState();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const slidesPerView = getSlidesPerView();
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSliderState();
            }
        });
    }

    // Touch events
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchmove', touchMove);
    slider.addEventListener('touchend', touchEnd);

    // Mouse events
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        slider.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;
        const slideWidth = slides[0].offsetWidth;
        const slidesPerView = getSlidesPerView();
        const maxIndex = slides.length - slidesPerView;

        // If moved enough negative, next slide
        if (movedBy < -100 && currentIndex < maxIndex) {
            currentIndex++;
        }
        // If moved enough positive, prev slide
        else if (movedBy > 100 && currentIndex > 0) {
            currentIndex--;
        }

        updateSliderState();
    }

    function animation() {
        if (isDragging) {
            setSliderPosition();
            requestAnimationFrame(animation);
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initSlider();
        }, 250);
    });

    // Initialize slider
    initSlider();

    // Autoplay functionality
    let autoplayInterval;
    const AUTOPLAY_DELAY = 5000;

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const slidesPerView = getSlidesPerView();
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSliderState();
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Start autoplay and handle hover
    startAutoplay();
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
}); 