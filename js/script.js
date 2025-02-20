document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');
    
    if (navToggle && navLeft && navRight) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLeft.classList.toggle('active');
            navRight.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking a link
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link') && (navLeft.classList.contains('active') || navRight.classList.contains('active'))) {
                navToggle.classList.remove('active');
                navLeft.classList.remove('active');
                navRight.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Slider functionality
    const slider = document.querySelector('.slider-track');
    if (slider) {
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
            
            if (prevButton && nextButton) {
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex >= slides.length - getVisibleSlides();
            }
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const visibleSlides = getVisibleSlides();
                if (currentIndex < slides.length - visibleSlides) {
                    currentIndex++;
                    updateSlider();
                }
            });
        }

        // Handle window resize
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

        // Initialize slider
        updateSlider();
    }

    // Set background images for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            const bgImage = card.getAttribute('data-bg-image');
            if (bgImage) {
                card.style.backgroundImage = `url(${bgImage})`;
            }
        });
    }

    // Catalog page functionality
    const productsGrid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    const categorySelect = document.querySelector('select[name="category"]');
    const priceSelect = document.querySelector('select[name="price"]');
    const sortSelect = document.querySelector('select[name="sort"]');

    // Only initialize catalog functionality if we're on the catalog page
    if (productsGrid && noResults && categorySelect && priceSelect && sortSelect) {
        // Get all product cards and store them
        const allProducts = Array.from(productsGrid.querySelectorAll('.product-card'));

        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category');

        // Set initial category from URL if present
        if (urlCategory) {
            const categoryMap = {
                'indian': 'indian',
                'chinese': 'chinese',
                'continental': 'continental',
                'desserts': 'desserts'
            };
            
            if (categoryMap[urlCategory]) {
                categorySelect.value = categoryMap[urlCategory];
                filterProducts();
            }
        }

        function filterProducts() {
            let filteredProducts = [...allProducts];

            // Filter by category
            const selectedCategory = categorySelect.value;
            if (selectedCategory) {
                filteredProducts = filteredProducts.filter(product => 
                    product.dataset.category === selectedCategory
                );
            }

            // Filter by price
            const selectedPrice = priceSelect.value;
            if (selectedPrice) {
                filteredProducts = filteredProducts.filter(product => {
                    const price = parseInt(product.dataset.price);
                    switch(selectedPrice) {
                        case 'under-500':
                            return price < 500;
                        case '500-1000':
                            return price >= 500 && price <= 1000;
                        case 'above-1000':
                            return price > 1000;
                        default:
                            return true;
                    }
                });
            }

            // Sort products
            const selectedSort = sortSelect.value;
            filteredProducts.sort((a, b) => {
                const priceA = parseInt(a.dataset.price);
                const priceB = parseInt(b.dataset.price);
                
                switch(selectedSort) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'newest':
                        return -1;
                    case 'popular':
                    default:
                        return allProducts.indexOf(a) - allProducts.indexOf(b);
                }
            });

            // Update display
            productsGrid.innerHTML = '';
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    productsGrid.appendChild(product.cloneNode(true));
                });
                noResults.style.display = 'none';
            } else {
                noResults.style.display = 'block';
            }

            // Update URL
            const newUrl = new URL(window.location.href);
            if (selectedCategory) {
                newUrl.searchParams.set('category', selectedCategory);
            } else {
                newUrl.searchParams.delete('category');
            }
            window.history.replaceState({}, '', newUrl);
        }

        // Add event listeners
        categorySelect.addEventListener('change', filterProducts);
        priceSelect.addEventListener('change', filterProducts);
        sortSelect.addEventListener('change', filterProducts);
    }
});