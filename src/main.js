// Entry point for the project
import './style.css';

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded! Please check if the GSAP script tags are properly included.');
        return;
    }

    // Check if ScrollTrigger is loaded
    if (typeof ScrollTrigger === 'undefined') {
        console.error('ScrollTrigger is not loaded! Please check if the ScrollTrigger script tag is properly included.');
        return;
    }

    // GSAP and plugins are already registered via script tags
    console.log('GSAP loaded successfully:', gsap.version);
    console.log('ScrollTrigger loaded successfully');

    // Performance optimizations for GSAP
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing
    gsap.config({
        autoSleep: 60,
        force3D: true,  // Force GPU acceleration
        nullTargetWarn: false // Reduce console warnings on mobile
    });

    // Mobile-specific performance optimizations
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Reduce animation quality on mobile for better performance
        gsap.config({
            autoSleep: 30,
            force3D: false // Disable 3D transforms on mobile to prevent rendering issues
        });

        // Disable scroll-triggered animations on mobile for better performance
        ScrollTrigger.config({
            refreshPriority: -1,
            ignoreMobileResize: true
        });
    }

    // Custom debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize all components
    init();

    // Comment popup functionality - Define before it's used
    function showCommentPopup(card) {
        console.log('Card clicked:', card); // Debug log

        // Extract data from the card with error checking
        const image = card.querySelector('.client-image');
        const nameElement = card.querySelector('.client-info h4');
        const titleElement = card.querySelector('.client-info span');
        const commentElement = card.querySelector('.comment-content p');

        if (!image || !nameElement || !titleElement || !commentElement) {
            console.error('Missing elements in card:', { image, nameElement, titleElement, commentElement });
            return;
        }

        const name = nameElement.textContent;
        const title = titleElement.textContent;
        const comment = commentElement.textContent;
        const date = card.dataset.date || 'No date available';
        const imageSrc = image.src;
        const imageAlt = image.alt;

        console.log('Creating popup with data:', { name, title, comment, date, imageSrc }); // Debug log

        // Create popup overlay if it doesn't exist
        let overlay = document.querySelector('.comment-popup-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'comment-popup-overlay';
            document.body.appendChild(overlay);
            console.log('Created new overlay'); // Debug log
        }

        // Create popup HTML
        overlay.innerHTML = `
            <div class="comment-popup">
                <button class="comment-popup-close">&times;</button>
                <div class="comment-popup-header">
                    <img src="${imageSrc}" alt="${imageAlt}" class="comment-popup-image">
                    <div class="comment-popup-info">
                        <h3>${name}</h3>
                        <div class="title">${title}</div>
                        <div class="date">${date}</div>
                    </div>
                </div>
                <div class="comment-popup-text">${comment}</div>
            </div>
        `;

        const popup = overlay.querySelector('.comment-popup');
        const closeBtn = overlay.querySelector('.comment-popup-close');

        console.log('Popup elements created:', { overlay, popup, closeBtn }); // Debug log

        // Set initial state for animation
        gsap.set(overlay, {
            opacity: 0,
            visibility: 'visible',
            pointerEvents: 'auto',
            display: 'flex'
        });
        gsap.set(popup, {
            scale: 0.8,
            y: 50,
            opacity: 0
        });

        // Animate popup in
        const openTl = gsap.timeline();
        openTl.to(overlay, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        })
            .to(popup, {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.2)"
            }, 0.1);

        console.log('Popup should now be visible'); // Debug log

        // Close handlers
        const closePopup = () => {
            const closeTl = gsap.timeline();
            closeTl.to(popup, {
                scale: 0.8,
                y: 50,
                opacity: 0,
                duration: 0.3,
                ease: "back.in(1.2)"
            })
                .to(overlay, {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none' });
                    }
                }, 0.1);
        };

        closeBtn.addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closePopup();
            }
        });

        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // Main initialization function
    function init() {
        initMenuAnimation();
        initMenuItemAnimations();
        initServiceCardAnimations();
        initContactAnimations();
        initAboutSectionAnimations();
        initAboutAnimatedBackground();
        initSectionTracking();
        setupSlider();
        lazyLoad();
        setupInfiniteScroll();
    }

    // Make sure ScrollTrigger is refreshed when window is fully loaded
    window.addEventListener('load', () => {
        // Force refresh ScrollTrigger to fix parallax issues
        ScrollTrigger.refresh(true);
    });

    // Menu scroll animation - simplified to work with shared menu structure
    function initMenuAnimation() {
        const mainMenu = document.querySelector('.main-menu');
        if (!mainMenu) return;

        // Let shared.css handle all the styling
        // No need for complex GSAP animations here since shared.js handles menu functionality
    }

    // Menu item hover and entrance animations
    function initMenuItemAnimations() {
        const menuLinks = document.querySelectorAll('.main-menu .button');

        menuLinks.forEach(link => {
            // Clear any existing styles first
            gsap.set(link, { clearProps: "all" });

            // We'll let CSS handle the hover animations
            // This removes the complex GSAP hover animations that were causing lag
        });

        // Keep the entrance animation
        gsap.from(menuLinks, {
            y: -10,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power1.out',
            clearProps: 'all'
        });
    }

    // Service Card Animations - Simplified for grid layout
    function initServiceCardAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');

        if (serviceCards.length === 0) {
            return;
        }

        // GSAP Timeline for initial animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#services',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Animate service cards on scroll with stagger effect
        serviceCards.forEach((card, index) => {
            tl.fromTo(card,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                },
                index * 0.2 // Stagger delay
            );
        });

        // Add click handlers for navigation
        serviceCards.forEach((card) => {
            const serviceLink = card.querySelector('.service-link');
            if (serviceLink) {
                // Add click event to entire card
                card.addEventListener('click', (e) => {
                    // Don't trigger if clicking on the link itself
                    if (e.target.closest('.service-link')) {
                        return;
                    }

                    // Trigger link click
                    serviceLink.click();
                });

                // Add keyboard support
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        serviceLink.click();
                    }
                });

                // Make card focusable
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', `Navigate to ${card.dataset.service} page`);
            }
        });
    }

    // Contact section animations
    function initContactAnimations() {
        // Initialize submit button animations
        initSubmitButtonAnimations();

        // Handle phone card click to copy
        const phoneCard = document.querySelector('.contact-card[data-phone]');
        if (phoneCard) {
            const copyIndicator = phoneCard.querySelector('.copy-indicator');
            if (copyIndicator) {
                const originalText = copyIndicator.textContent;

                phoneCard.addEventListener('click', async () => {
                    const phone = phoneCard.dataset.phone;
                    try {
                        await navigator.clipboard.writeText(phone);

                        // Simple feedback without GSAP animation
                        copyIndicator.textContent = 'Number copied!';
                        copyIndicator.style.opacity = '1';
                        copyIndicator.style.transform = 'translateY(0)';

                        // Reset after 2 seconds
                        setTimeout(() => {
                            copyIndicator.style.opacity = '0';
                            copyIndicator.style.transform = 'translateY(10px)';

                            // Reset text after fade out
                            setTimeout(() => {
                                copyIndicator.textContent = originalText;
                            }, 300);
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                });
            }
        }

        // Fix card animations - make them immediately visible
        const contactCards = document.querySelectorAll('.contact-card.small-card');

        if (contactCards.length) {
            // Make cards immediately visible instead of animating them in
            contactCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) translateZ(0)';
                card.style.display = 'flex';
                card.style.visibility = 'visible';
                card.classList.add('card-visible');
            });

            // Optimized hover effects for cards and icons - faster and less laggy
            contactCards.forEach(card => {
                const icon = card.querySelector('.contact-icon');

                // Precompute the animation values
                const cardHoverProps = {
                    y: -5,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                    duration: 0.15, // Faster animation
                    ease: 'power1.out' // Simpler easing
                };

                const cardNormalProps = {
                    y: 0,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    duration: 0.15, // Faster animation
                    ease: 'power1.out' // Simpler easing
                };

                const iconHoverProps = {
                    scale: 1.2,
                    opacity: 0.9,
                    duration: 0.15, // Faster animation
                    ease: 'power1.out' // Simpler easing
                };

                const iconNormalProps = {
                    scale: 1,
                    opacity: 1,
                    duration: 0.15, // Faster animation
                    ease: 'power1.out' // Simpler easing
                };

                // Add mouseenter event for card hover
                card.addEventListener('mouseenter', () => {
                    // Kill any ongoing animations to prevent lag
                    gsap.killTweensOf(card);
                    if (icon) gsap.killTweensOf(icon);

                    // Animate card and icon simultaneously
                    gsap.to(card, cardHoverProps);
                    if (icon) gsap.to(icon, iconHoverProps);
                });

                // Add mouseleave event
                card.addEventListener('mouseleave', () => {
                    // Kill any ongoing animations to prevent lag
                    gsap.killTweensOf(card);
                    if (icon) gsap.killTweensOf(icon);

                    // Animate card and icon simultaneously
                    gsap.to(card, cardNormalProps);
                    if (icon) gsap.to(icon, iconNormalProps);
                });
            });
        }
    }

    // Submit button GSAP animations
    function initSubmitButtonAnimations() {
        const submitButton = document.querySelector('.submit-button');
        if (!submitButton) return;

        // Create shine element since we can't easily target ::before with GSAP
        const shineElement = document.createElement('div');
        shineElement.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            pointer-events: none;
            z-index: 1;
        `;
        submitButton.appendChild(shineElement);

        // Hover enter animation
        submitButton.addEventListener('mouseenter', () => {
            if (submitButton.disabled) return;

            gsap.to(submitButton, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            });

            // Shine effect
            gsap.fromTo(shineElement,
                { left: '-100%' },
                {
                    left: '100%',
                    duration: 0.6,
                    ease: "power2.out"
                }
            );
        });

        // Hover leave animation
        submitButton.addEventListener('mouseleave', () => {
            if (submitButton.disabled) return;

            gsap.to(submitButton, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            });
        });

        // Click/tap animation
        submitButton.addEventListener('mousedown', () => {
            if (submitButton.disabled) return;

            gsap.to(submitButton, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        submitButton.addEventListener('mouseup', () => {
            if (submitButton.disabled) return;

            gsap.to(submitButton, {
                scale: 1.05,
                duration: 0.2,
                ease: "back.out(1.7)"
            });
        });

        // Touch events for mobile
        submitButton.addEventListener('touchstart', () => {
            if (submitButton.disabled) return;

            gsap.to(submitButton, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        submitButton.addEventListener('touchend', () => {
            if (submitButton.disabled) return;

            gsap.to(submitButton, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
    }

    // About section animations - Now handled by initAboutAnimatedBackground
    function initAboutSectionAnimations() {
        const aboutSection = document.querySelector('.about-section');
        if (!aboutSection) return;

        // Only animate certificates now, the main content is handled by glass cards
        const certificates = aboutSection.querySelectorAll('.certificate-item');

        // Certificates animation
        certificates.forEach((cert, index) => {
            ScrollTrigger.create({
                trigger: cert,
                start: 'top bottom-=50',
                onEnter: () => {
                    gsap.to(cert, {
                        y: 0,
                        opacity: 1,
                        delay: index * 0.1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // About Section animated background and glass cards
    function initAboutAnimatedBackground() {
        const aboutSection = document.querySelector('#about');
        if (!aboutSection) return;

        const interactiveBubble = aboutSection.querySelector('.interactive');
        const glassCards = aboutSection.querySelectorAll('.glass-card');
        const sectionTitle = aboutSection.querySelector('h2');

        // Interactive mouse-following bubble effect
        if (interactiveBubble) {
            let curX = 0;
            let curY = 0;
            let tgX = 0;
            let tgY = 0;

            function moveInteractiveBubble() {
                curX += (tgX - curX) / 20;
                curY += (tgY - curY) / 20;
                interactiveBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
                requestAnimationFrame(moveInteractiveBubble);
            }

            // Mouse move handler
            const handleMouseMove = (event) => {
                const rect = aboutSection.getBoundingClientRect();
                tgX = event.clientX - rect.left;
                tgY = event.clientY - rect.top;
            };

            // Only add mouse movement when section is visible
            let isListening = false;
            ScrollTrigger.create({
                trigger: aboutSection,
                start: 'top bottom',
                end: 'bottom top',
                onEnter: () => {
                    if (!isListening) {
                        aboutSection.addEventListener('mousemove', handleMouseMove);
                        isListening = true;
                        moveInteractiveBubble();
                    }
                },
                onLeave: () => {
                    if (isListening) {
                        aboutSection.removeEventListener('mousemove', handleMouseMove);
                        isListening = false;
                    }
                },
                onEnterBack: () => {
                    if (!isListening) {
                        aboutSection.addEventListener('mousemove', handleMouseMove);
                        isListening = true;
                        moveInteractiveBubble();
                    }
                },
                onLeaveBack: () => {
                    if (isListening) {
                        aboutSection.removeEventListener('mousemove', handleMouseMove);
                        isListening = false;
                    }
                }
            });
        }

        // Title animation
        ScrollTrigger.create({
            trigger: sectionTitle,
            start: 'top bottom-=100',
            onEnter: () => {
                gsap.from(sectionTitle, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });

        // Glass cards animation - Fix the frozen card issue
        glassCards.forEach((card, index) => {
            // Set initial hidden state
            gsap.set(card, {
                y: 60,
                opacity: 0,
                scale: 0.8
            });

            // Entrance animation
            ScrollTrigger.create({
                trigger: card,
                start: 'top bottom-=50',
                onEnter: () => {
                    gsap.to(card, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: 'back.out(1.7)'
                    });
                }
            });

            // Enhanced hover animations
            const cardIcon = card.querySelector('.card-icon');
            const cardInner = card.querySelector('.glass-card-inner');
            const highlights = card.querySelectorAll('.highlight');

            card.addEventListener('mouseenter', () => {
                // Card tilt effect
                gsap.to(card, {
                    rotationX: 5,
                    rotationY: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Icon animation
                if (cardIcon) {
                    gsap.to(cardIcon, {
                        scale: 1.2,
                        rotation: 10,
                        duration: 0.3,
                        ease: 'back.out(1.7)'
                    });
                }

                // Highlight animations
                highlights.forEach((highlight, i) => {
                    gsap.to(highlight, {
                        scale: 1.05,
                        delay: i * 0.05,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });
            });

            card.addEventListener('mouseleave', () => {
                // Reset card tilt
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Reset icon
                if (cardIcon) {
                    gsap.to(cardIcon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }

                // Reset highlights
                highlights.forEach((highlight) => {
                    gsap.to(highlight, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });
            });

            // Click animation
            card.addEventListener('click', () => {
                gsap.to(card, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(card, {
                            scale: 1,
                            duration: 0.3,
                            ease: 'back.out(1.7)'
                        });
                    }
                });
            });
        });
    }

    // Section tracking for navigation highlighting
    function initSectionTracking() {
        const sections = document.querySelectorAll('section[id]');
        const menuLinks = document.querySelectorAll('.main-menu a[href^="#"]');

        if (!sections.length || !menuLinks.length) return;

        // Clear any existing active states on page load
        menuLinks.forEach(link => {
            link.classList.remove('active-section');
            link.removeAttribute('data-active');
        });

        // Map menu buttons by their href
        const menuButtons = {};
        menuLinks.forEach(link => {
            menuButtons[link.getAttribute('href')] = link;
        });

        // Create ScrollTrigger for each section
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onToggle: ({ isActive }) => {
                    const button = menuButtons['#' + section.id];
                    if (!button) return;

                    if (isActive) {
                        button.classList.add('active-section');
                        button.setAttribute('data-active', 'true');
                    } else {
                        button.classList.remove('active-section');
                        button.removeAttribute('data-active');
                    }

                    // Let CSS handle the visual changes
                }
            });
        });
    }

    // Hero slider functionality
    function setupSlider() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;

        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-nav.prev');
        const nextBtn = document.querySelector('.slider-nav.next');
        const indicators = document.querySelectorAll('.indicator');

        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoplayInterval;
        const autoplayDelay = 7000; // Longer delay between transitions
        let isAnimating = false; // Prevent animation overlapping

        // Initialize indicators 
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!isAnimating) goToSlide(index);
            });
        });

        // Add button event listeners
        prevBtn?.addEventListener('click', () => {
            if (!isAnimating) navigate(-1);
        });
        nextBtn?.addEventListener('click', () => {
            if (!isAnimating) navigate(1);
        });

        // Touch gesture support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            stopAutoplay(); // Stop autoplay when touching
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    if (!isAnimating) navigate(-1);
                } else {
                    // Swipe left - go to next slide  
                    if (!isAnimating) navigate(1);
                }
            }

            // Restart autoplay after touch interaction
            setTimeout(startAutoplay, 2000);
        }, { passive: true });

        // Start autoplay
        startAutoplay();

        // Stop autoplay on slider hover
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);

        // Preload all images immediately for smoother transitions
        preloadAllImages();

        // Preload all slide images
        function preloadAllImages() {
            slides.forEach(slide => {
                const img = slide.querySelector('.slide-bg img');
                if (img && img.dataset.src) {
                    // Create a new image to preload
                    const preloadImg = new Image();
                    preloadImg.src = img.dataset.src;

                    // Once preloaded, update the actual image
                    preloadImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    };
                }
            });
        }

        // Update slide with optimized animation
        function updateSlide() {
            if (isAnimating) return;
            isAnimating = true;

            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

            // Get current and previous slides
            const currentSlide = slides[currentIndex];
            const oldSlides = Array.from(slides).filter(s => s !== currentSlide);

            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
                // Prepare the new slide
                gsap.set(currentSlide, {
                    zIndex: 2,
                    opacity: 0,
                    display: 'block'
                });

                // Add active class to enable CSS transitions
                currentSlide.classList.add('active');

                // Hide old slides immediately
                oldSlides.forEach(slide => {
                    slide.classList.remove('active');
                    gsap.set(slide, { opacity: 0, zIndex: 1 });
                });

                // Simple fade in of the new slide
                gsap.to(currentSlide, {
                    opacity: 1,
                    duration: 0.5, // Slightly faster for better responsiveness
                    ease: 'power1.out',
                    onComplete: () => {
                        isAnimating = false;
                    }
                });

                // Animate the content separately
                const content = currentSlide.querySelector('.slide-content');
                gsap.fromTo(content,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' }
                );
            });
        }

        // Navigate through slides
        function navigate(direction) {
            if (isAnimating) return;
            currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
            updateSlide();
            resetAutoplay();
        }

        // Go to specific slide
        function goToSlide(index) {
            if (isAnimating || index === currentIndex) return;
            currentIndex = index;
            updateSlide();
            resetAutoplay();
        }

        // Autoplay functions
        function startAutoplay() {
            if (autoplayInterval) return;
            autoplayInterval = setInterval(() => {
                if (!isAnimating) navigate(1);
            }, autoplayDelay);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Initial slide setup
        updateSlide();
    }

    // Lazy loading images
    function lazyLoad() {
        const lazyImages = document.querySelectorAll("img.lazy-load");

        if (!lazyImages.length) return;

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        };

        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;

                    if (src) {
                        img.src = src;
                        img.addEventListener('load', () => handleImageLoad(img));
                        observer.unobserve(img);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        lazyImages.forEach(img => observer.observe(img));
    }

    // Image load handler
    function handleImageLoad(img) {
        img.classList.add('loaded');
        gsap.to(img, {
            opacity: 1,
            duration: 0.5,
            ease: 'power1.out'
        });
    }

    // Enhanced infinite scroll for comments with GSAP animations
    function setupInfiniteScroll() {
        const container = document.querySelector('.infinite-scroll-container');
        if (!container) return;

        const cards = container.querySelectorAll('.comment-card');
        if (cards.length < 2) return;

        // Clone cards for infinite scroll effect (limit to just a few for better performance)
        const maxClones = Math.min(4, cards.length);
        for (let i = 0; i < maxClones; i++) {
            const clone = cards[i % cards.length].cloneNode(true);
            container.appendChild(clone);
        }

        // Add enhanced hover animations and click handlers for glass cards
        const allCards = container.querySelectorAll('.comment-card');
        allCards.forEach((card, index) => {
            const clientImage = card.querySelector('.client-image');

            // Enhanced hover animation with GSAP
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    rotationY: 2,
                    duration: 0.3,
                    ease: "power2.out"
                });

                if (clientImage) {
                    gsap.to(clientImage, {
                        scale: 1.1,
                        rotation: 5,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    rotationY: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });

                if (clientImage) {
                    gsap.to(clientImage, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            // Add click handler for popup
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                showCommentPopup(card);
            });
        });

        // Create a more optimized animation
        const scrollTween = gsap.to(container, {
            x: `-50%`,
            duration: cards.length * 10, // Slightly slower for better visibility
            ease: "linear", // Use linear for smoother scrolling
            repeat: -1,
            paused: true
        });

        // Use a simpler scroll trigger that doesn't constantly update
        ScrollTrigger.create({
            trigger: "#portfolio",
            start: "top bottom",
            end: "bottom top",
            once: false,
            onEnter: () => scrollTween.play(),
            onLeaveBack: () => scrollTween.pause()
        });
    }
});

// Mobile menu functionality now handled by shared.js

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    // Check if EmailJS config is loaded
    if (!window.EMAILJS_CONFIG) {
        console.error('EmailJS configuration not found! Please check js/emailjs-config.js');
        return;
    }

    // Use the external configuration
    const config = window.EMAILJS_CONFIG;

    // Initialize EmailJS
    emailjs.init(config.PUBLIC_KEY);

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Phone validation (optional field, but validate format if provided)
            if (phone && phone.length > 0) {
                const phoneRegex = /^\d{8}$/;
                if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
                    showMessage('Please enter a valid 8-digit phone number.', 'error');
                    return;
                }
            }

            // Show loading state
            const submitButton = contactForm.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Prepare template parameters
                const templateParams = {
                    name: name,
                    phone: phone || 'Not provided',
                    email: email,
                    subject: subject || 'Contact Form Submission',
                    message: message,
                    to_email: config.TO_EMAIL
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    config.SERVICE_ID,
                    config.TEMPLATE_ID,
                    templateParams
                );

                console.log('SUCCESS!', response.status, response.text);

                // Show success message with glass popup
                showGlassPopup('Thank you for sending email!');

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('FAILED...', error);

                // Show error message
                let errorMessage = 'Failed to send message. Please try again.';

                if (error.text) {
                    errorMessage += ` Error: ${error.text}`;
                } else if (error.message) {
                    errorMessage += ` Error: ${error.message}`;
                }

                showMessage(errorMessage, 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Function to show glass popup message
    function showGlassPopup(message) {
        // Remove existing popups
        const existingPopups = document.querySelectorAll('.glass-popup-message');
        existingPopups.forEach(popup => popup.remove());

        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'glass-popup-message';
        popup.textContent = message;

        // Add to body
        document.body.appendChild(popup);

        // Animate popup in with GSAP
        gsap.set(popup, {
            scale: 0,
            opacity: 0,
            rotation: -5
        });

        const tl = gsap.timeline();

        // Popup appears
        tl.to(popup, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        });

        // Stay visible for 4 seconds
        tl.to(popup, {
            duration: 4
        });

        // Popup disappears
        tl.to(popup, {
            scale: 0,
            opacity: 0,
            rotation: 5,
            duration: 0.4,
            ease: "back.in(1.7)",
            onComplete: () => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }
        });
    }

    // Function to show messages (for errors)
    function showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-${type}-message`;
        messageElement.textContent = message;

        // Insert message above the form
        contactForm.parentNode.insertBefore(messageElement, contactForm);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);

        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

});
