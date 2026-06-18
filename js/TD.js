// Error handling for browser extensions
window.addEventListener('error', function (e) {
    if (e.message && e.message.includes('message channel closed')) {
        e.preventDefault();
        return false;
    }
});

window.addEventListener('unhandledrejection', function (e) {
    if (e.reason && e.reason.message && e.reason.message.includes('message channel closed')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    let isAnimating = false;
    const cards = gsap.utils.toArray('.cards li');
    const dots = gsap.utils.toArray('.dot');
    const totalCards = cards.length;
    const backgroundElement = document.querySelector('.gallery-background');

    // Check for required elements
    if (!cards.length || !dots.length || !backgroundElement) {
        console.warn('TD.js: Essential gallery elements not found');
        return;
    }

    // Update background image
    function updateBackground(index) {
        const currentCard = cards[index];
        if (!currentCard) return;

        const bgImage = currentCard.getAttribute('data-bg');
        if (!bgImage) return;

        gsap.to(backgroundElement, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                backgroundElement.style.backgroundImage = `url(${bgImage})`;
                gsap.to(backgroundElement, {
                    opacity: 0.2,
                    duration: 0.2
                });
            }
        });
    }

    // Initialize card positions
    function initializeCards() {
        // Set all cards to default position
        gsap.set(cards, {
            xPercent: 100,
            opacity: 0,
            visibility: 'hidden',
            scale: 0.8,
            rotateY: 90
        });

        // Active card (center)
        if (cards[0]) {
            gsap.set(cards[0], {
                xPercent: 0,
                opacity: 1,
                visibility: 'visible',
                scale: 1,
                rotateY: 0,
                zIndex: 5
            });
        }

        // Next card (right)
        if (cards[1]) {
            gsap.set(cards[1], {
                xPercent: 100,
                opacity: 0.6,
                visibility: 'visible',
                scale: 0.8,
                rotateY: 45,
                zIndex: 4
            });
        }

        // Previous card (left)
        if (cards[totalCards - 1]) {
            gsap.set(cards[totalCards - 1], {
                xPercent: -100,
                opacity: 0.6,
                visibility: 'visible',
                scale: 0.8,
                rotateY: -45,
                zIndex: 4
            });
        }

        // Far right card
        if (cards[2]) {
            gsap.set(cards[2], {
                xPercent: 200,
                opacity: 0.3,
                visibility: 'visible',
                scale: 0.6,
                rotateY: 90,
                zIndex: 3
            });
        }

        // Far left card
        if (cards[totalCards - 2]) {
            gsap.set(cards[totalCards - 2], {
                xPercent: -200,
                opacity: 0.3,
                visibility: 'visible',
                scale: 0.6,
                rotateY: -90,
                zIndex: 3
            });
        }

        updateDots(0);
        updateBackground(0);
    }

    // Update dot indicators
    function updateDots(newIndex) {
        dots.forEach((dot, index) => {
            if (index === newIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-pressed', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // Navigate to specific card
    function goToCard(index, direction = 1) {
        if (isAnimating || index < 0 || index >= totalCards) return;
        isAnimating = true;

        const prevIndex = currentIndex;
        currentIndex = index;

        // Animation timeline
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                updateBackground(currentIndex);
            }
        });

        // Calculate card positions
        const indices = {
            farPrev: (currentIndex - 2 + totalCards) % totalCards,
            prev: (currentIndex - 1 + totalCards) % totalCards,
            current: currentIndex,
            next: (currentIndex + 1) % totalCards,
            farNext: (currentIndex + 2) % totalCards
        };

        // Make cards visible
        gsap.set(cards, { visibility: 'visible' });

        // Animate card transitions
        tl.to(cards[prevIndex], {
            xPercent: -100 * direction,
            opacity: 0.6,
            scale: 0.8,
            rotateY: direction > 0 ? -45 : 45,
            zIndex: 4,
            duration: 0.35,
            ease: "power2.inOut"
        })
            .to(cards[indices.current], {
                xPercent: 0,
                opacity: 1,
                scale: 1,
                rotateY: 0,
                zIndex: 5,
                duration: 0.35,
                ease: "power2.inOut"
            }, '<')
            .to(cards[indices.prev], {
                xPercent: -100,
                opacity: 0.6,
                scale: 0.8,
                rotateY: -45,
                zIndex: 4,
                duration: 0.35,
                ease: "power2.inOut"
            }, '<')
            .to(cards[indices.next], {
                xPercent: 100,
                opacity: 0.6,
                scale: 0.8,
                rotateY: 45,
                zIndex: 4,
                duration: 0.35,
                ease: "power2.inOut"
            }, '<')
            .to(cards[indices.farPrev], {
                xPercent: -200,
                opacity: 0.3,
                scale: 0.6,
                rotateY: -90,
                zIndex: 3,
                duration: 0.35,
                ease: "power2.inOut"
            }, '<')
            .to(cards[indices.farNext], {
                xPercent: 200,
                opacity: 0.3,
                scale: 0.6,
                rotateY: 90,
                zIndex: 3,
                duration: 0.35,
                ease: "power2.inOut"
            }, '<');

        updateDots(currentIndex);
    }

    // Navigation helper functions
    const getPrevIndex = () => (currentIndex - 1 + totalCards) % totalCards;
    const getNextIndex = () => (currentIndex + 1) % totalCards;

    // Navigation buttons
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (nextBtn) {
        nextBtn.addEventListener("click", () => goToCard(getNextIndex(), 1));
        nextBtn.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToCard(getNextIndex(), 1);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => goToCard(getPrevIndex(), -1));
        prevBtn.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToCard(getPrevIndex(), -1);
            }
        });
    }

    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex && !isAnimating) {
                goToCard(index, index > currentIndex ? 1 : -1);
            }
        });

        dot.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && index !== currentIndex && !isAnimating) {
                e.preventDefault();
                goToCard(index, index > currentIndex ? 1 : -1);
            }
        });
    });

    // Touch handling
    const gallery = document.querySelector('.gallery');
    let startX, startTime;

    gallery.addEventListener('touchstart', (e) => {
        if (!isAnimating) {
            startX = e.touches[0].clientX;
            startTime = Date.now();
        }
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
        if (!startX || isAnimating) return;

        const diff = startX - e.touches[0].clientX;
        const timeDiff = Date.now() - startTime;

        if (Math.abs(diff) > 50 && timeDiff < 300) {
            startX = null;
            diff > 0 ? goToCard(getNextIndex(), 1) : goToCard(getPrevIndex(), -1);
        }
    }, { passive: true });

    gallery.addEventListener('touchend', () => {
        startX = null;
    }, { passive: true });

    initializeCards();

    // Initialize list section animations
    initializeListSection();
});

// List Section Animations
function initializeListSection() {
    // Add GSAP animations for product cards in list section
    const productCards = document.querySelectorAll('.list-section .product-card');

    // Early return if no product cards found
    if (!productCards.length) {
        console.log('TD.js: No product cards found in list section');
        return;
    }

    // Function to animate cards in when they come into view
    const animateCardsIn = () => {
        productCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "power2.out"
                }
            );
        });
    };

    // Simplified hover animations for each card - only animate image
    productCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function () {
            const image = this.querySelector('.product-image img');

            // Only animate the image since overlay and description are removed/always visible
            if (image) {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener('mouseleave', function () {
            const image = this.querySelector('.product-image img');

            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    });

    // Animate cards when they come into view using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCardsIn();
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1
    });

    const listSection = document.querySelector('.list-section');
    if (listSection) {
        observer.observe(listSection);
    } else {
        console.log('TD.js: List section not found');
    }
}

// ========== IMAGE GALLERY FUNCTIONALITY ==========

// Product image galleries - simulate multiple images per product
const productGalleries = {
    product1: [
        '../assets/images/card1.jpg',
        '../assets/images/card2.jpg',
        '../assets/images/card3.jpg',
        '../assets/images/card4.jpg',
        '../assets/images/portrait.jpg'
    ],
    product2: [
        '../assets/images/card2.jpg',
        '../assets/images/card1.jpg',
        '../assets/images/card4.jpg',
        '../assets/images/portrait.jpg',
        '../assets/images/card3.jpg'
    ],
    product3: [
        '../assets/images/card3.jpg',
        '../assets/images/card4.jpg',
        '../assets/images/card1.jpg',
        '../assets/images/portrait.jpg',
        '../assets/images/card2.jpg'
    ],
    product4: [
        '../assets/images/card4.jpg',
        '../assets/images/portrait.jpg',
        '../assets/images/card2.jpg',
        '../assets/images/card1.jpg',
        '../assets/images/card3.jpg'
    ],
    product5: [
        '../assets/images/portrait.jpg',
        '../assets/images/card1.jpg',
        '../assets/images/card3.jpg',
        '../assets/images/card2.jpg',
        '../assets/images/card4.jpg'
    ],
    product6: [
        '../assets/images/service1.jpg',
        '../assets/images/card1.jpg',
        '../assets/images/card2.jpg',
        '../assets/images/card3.jpg',
        '../assets/images/card4.jpg'
    ]
};

// Initialize gallery functionality
function initializeGallery() {
    const galleryModal = document.getElementById('galleryModal');
    const galleryClose = document.getElementById('galleryClose');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const mainImage = document.getElementById('mainImage');
    const imageCounter = document.getElementById('imageCounter');
    const galleryThumbnails = document.getElementById('galleryThumbnails');
    const galleryTitle = document.querySelector('.gallery-title');

    let currentGallery = [];
    let currentImageIndex = 0;

    // Open gallery modal
    function openGallery(productId) {
        currentGallery = productGalleries[productId] || [];
        currentImageIndex = 0;

        if (currentGallery.length === 0) {
            console.warn('No gallery images found for:', productId);
            return;
        }

        // Update gallery title
        if (galleryTitle) {
            galleryTitle.textContent = `Product ${productId.replace('product', '')} Gallery`;
        }

        // Show modal
        galleryModal.classList.add('active');
        galleryModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus management
        if (galleryClose) {
            galleryClose.focus();
        }

        // Load images
        updateMainImage();
        generateThumbnails();
    }

    // Update main image
    function updateMainImage() {
        const imageSrc = currentGallery[currentImageIndex];
        if (!imageSrc || !mainImage) return;

        // Add loading state
        mainImage.style.opacity = '0.5';

        // Create new image to preload
        const newImage = new Image();
        newImage.onload = () => {
            mainImage.src = imageSrc;
            mainImage.alt = `Product image ${currentImageIndex + 1} of ${currentGallery.length}`;
            mainImage.style.opacity = '1';
        };
        newImage.onerror = () => {
            console.warn('Failed to load image:', imageSrc);
            mainImage.style.opacity = '1';
        };
        newImage.src = imageSrc;

        if (imageCounter) {
            imageCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
        }
        updateThumbnailsActiveState();
    }

    // Generate thumbnails
    function generateThumbnails() {
        if (!galleryThumbnails) return;
        galleryThumbnails.innerHTML = '';

        currentGallery.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('button');
            thumbnail.className = 'thumbnail';
            thumbnail.type = 'button';
            thumbnail.setAttribute('aria-label', `View image ${index + 1}`);

            if (index === 0) thumbnail.classList.add('active');

            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Thumbnail ${index + 1}`;
            img.loading = 'lazy';

            // Error handling for thumbnails
            img.onerror = () => {
                console.warn('Failed to load thumbnail:', imageSrc);
                thumbnail.style.display = 'none';
            };

            thumbnail.appendChild(img);
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage();
            });

            // Keyboard support
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentImageIndex = index;
                    updateMainImage();
                }
            });

            galleryThumbnails.appendChild(thumbnail);
        });
    }

    // Update active thumbnail
    function updateThumbnailsActiveState() {
        const thumbnails = galleryThumbnails.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Navigation functions
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        updateMainImage();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        updateMainImage();
    }

    // Close gallery modal
    function closeGallery() {
        galleryModal.classList.remove('active');
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Return focus to trigger element
        const activeProductImage = document.querySelector(`.product-image[data-product="${getCurrentProductId()}"]`);
        if (activeProductImage) {
            activeProductImage.focus();
        }
    }

    // Get current product ID
    function getCurrentProductId() {
        const productIds = Object.keys(productGalleries);
        return productIds.find(id => productGalleries[id] === currentGallery) || 'product1';
    }

    // Event listeners
    if (galleryClose) {
        galleryClose.addEventListener('click', closeGallery);
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', nextImage);
    }

    if (galleryPrev) {
        galleryPrev.addEventListener('click', prevImage);
    }

    // Close on background click
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeGallery();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Add event listeners to product images
    const productImages = document.querySelectorAll('.product-image[data-product]');
    productImages.forEach(imageContainer => {
        const productId = imageContainer.getAttribute('data-product');
        if (!productId) return;

        // Click handler
        imageContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openGallery(productId);
        });

        // Keyboard handler
        imageContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openGallery(productId);
            }
        });

        // Visual feedback
        imageContainer.style.cursor = 'pointer';
    });
}

// Initialize gallery functionality
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeGallery, 100);
});