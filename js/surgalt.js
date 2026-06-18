// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimations();
    initCategoryAnimations();
    initCoursesSectionAnimations();
    initToggleCoursesSection();
    initSmoothScroll();
    initFormValidation();
});

// Hero animations
function initHeroAnimations() {
    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
            duration: 1.2
        }
    });

    // Hero content animation
    heroTimeline.from(".hero-content", {
        scale: 0.95,
        y: 20,
        duration: 1.2,
        ease: "power2.out"
    });

    // Title highlight effect
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
        heroTimeline.from(heroTitle, {
            textShadow: "0 0 0px rgba(0,0,0,0)",
            scale: 0.98,
            duration: 1.5,
            ease: "power2.out"
        }, "-=1");
    }
}

// Category card animations
function initCategoryAnimations() {
    const categoryCards = document.querySelectorAll('.category-card');

    if (!categoryCards.length) return;

    // Main timeline for category cards
    const categoriesTimeline = gsap.timeline({
        defaults: {
            ease: "power2.out"
        },
        scrollTrigger: {
            trigger: ".categories-container",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // Staggered card animation
    categoriesTimeline.to(categoryCards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15
    });

    // Hover effects for each card
    categoryCards.forEach(card => {
        const hoverTimeline = gsap.timeline({ paused: true });
        const cardIcon = card.querySelector('.category-icon');
        const cardTitle = card.querySelector('.category-title');

        if (cardIcon && cardTitle) {
            hoverTimeline
                .to(cardIcon, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power1.out"
                }, 0)
                .to(cardTitle, {
                    color: "#c9d6ff",
                    duration: 0.3,
                    ease: "power1.out"
                }, 0);

            // Event listeners
            card.addEventListener('mouseenter', () => hoverTimeline.play());
            card.addEventListener('mouseleave', () => hoverTimeline.reverse());

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const link = card.querySelector('a');
                    if (link) {
                        e.preventDefault();
                        link.click();
                    }
                }
            });
        }
    });

    // Individual card scroll triggers
    categoryCards.forEach((card, index) => {
        gsap.set(card, {
            opacity: 0,
            y: 50
        });

        ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power2.out"
                });
            },
            once: true
        });
    });
}

// Courses section animations
function initCoursesSectionAnimations() {
    // Select all course sections
    const coursesSections = document.querySelectorAll('.courses-section');

    // Animate each section separately
    coursesSections.forEach(section => {
        // Create a timeline for the section
        const sectionTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });

        // Animate section title and description
        sectionTimeline
            .to(section.querySelector(".section-title"), {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            })
            .to(section.querySelector(".section-description"), {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6")
            .to(section.querySelector(".view-all-btn"), {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            }, "-=0.6");
    });

    // Add hover animations for all course cards
    const allCourseCards = document.querySelectorAll('.course-card');
    allCourseCards.forEach(card => {
        const hoverTl = gsap.timeline({ paused: true });
        const cardTitle = card.querySelector('.course-title');

        hoverTl.to(cardTitle, {
            color: "#7c4dff",
            duration: 0.3,
            ease: "power1.out"
        });

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
    });
}

// Toggle courses section expand/collapse functionality
function initToggleCoursesSection() {
    // Select all course sections
    const coursesSections = document.querySelectorAll('.courses-section');

    coursesSections.forEach(section => {
        const viewAllBtn = section.querySelector('.view-all-btn');
        const courseCards = section.querySelectorAll('.course-card');
        const hiddenCards = Array.from(courseCards).slice(3);  // Hide cards after the first 3
        const container = section.querySelector('.container');

        // Initially set all cards to visible state but only animate the first 3
        const visibleCards = Array.from(courseCards).slice(0, 3);

        // Optimize by using will-change to help browser prepare for animations
        gsap.set(courseCards, {
            opacity: 0,
            y: 30,
            willChange: "opacity, transform"
        });

        // Animate in the first 3 cards of each section more efficiently
        gsap.to(visibleCards, {
            opacity: 1,
            y: 0,
            duration: 0.6, // Slightly reduced duration
            stagger: 0.08, // Less stagger time
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%"
            },
            onComplete: () => {
                // Remove will-change after animation completes to free up resources
                gsap.set(visibleCards, { willChange: "auto" });
            }
        });

        if (!viewAllBtn) return;

        // Set initial state for the button with fewer properties
        gsap.set(viewAllBtn, {
            opacity: 0,
            scale: 0.9
        });

        // Animate button more efficiently
        ScrollTrigger.create({
            trigger: viewAllBtn,
            start: "top 90%",
            onEnter: () => {
                gsap.to(viewAllBtn, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4, // Faster animation
                    ease: "back.out(1.5)" // Slightly less bouncy
                });
            },
            once: true
        });

        // Add click event for toggling with simplified animations
        viewAllBtn.addEventListener('click', () => {
            const isCollapsed = section.classList.contains('collapsed');

            // Toggle class
            section.classList.toggle('collapsed');
            section.classList.toggle('expanded');

            // Create animation timeline with better performance
            const tl = gsap.timeline({
                defaults: {
                    duration: 0.4, // Faster animations
                    ease: "power2.out" // Smoother ease
                }
            });

            if (isCollapsed) {
                // Expand section with simpler, more performant animations
                tl.to(section, {
                    padding: "100px 0",
                    duration: 0.5,
                    ease: "power1.out" // Smoother, less complex ease
                }, 0);

                // Reveal the cards container
                tl.to(section.querySelector('.course-cards-container'), {
                    maxHeight: 2000, // Slightly lower value still accommodates cards
                    duration: 0.6,
                    ease: "power1.out"
                }, 0);

                // Reveal the full description
                tl.to(section.querySelector('.section-description'), {
                    maxHeight: "none",
                    duration: 0.4
                }, 0.1);

                // Batch animate hidden cards for better performance
                gsap.set(hiddenCards, { display: 'block', opacity: 0, y: 30 });

                // Delayed animation of hidden cards in smaller batches
                setTimeout(() => {
                    // Animate in smaller batches for better performance
                    for (let i = 0; i < hiddenCards.length; i += 3) {
                        const batch = hiddenCards.slice(i, i + 3);
                        gsap.to(batch, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.05,
                            ease: "power1.out",
                            delay: i * 0.01 // Very small staggered delay between batches
                        });
                    }
                }, 200);

                // Change button icon
                tl.to(viewAllBtn.querySelector('.toggle-icon'), {
                    rotation: 45,
                    duration: 0.3
                }, 0);

            } else {
                // Collapse section with more efficient animations
                tl.to(section, {
                    padding: "50px 0",
                    duration: 0.5,
                    ease: "power1.out"
                }, 0);

                // Collapse the cards container
                tl.to(section.querySelector('.course-cards-container'), {
                    maxHeight: 700, // Ensure enough height for 3 cards
                    duration: 0.5,
                    ease: "power1.out"
                }, 0);

                // Collapse the description
                tl.to(section.querySelector('.section-description'), {
                    maxHeight: "3em",
                    duration: 0.4
                }, 0);

                // Simplify hiding cards - fade out all at once
                gsap.to(hiddenCards, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    ease: "power1.in",
                    onComplete: () => {
                        gsap.set(hiddenCards, { display: 'none' });
                    }
                });

                // Change button icon
                tl.to(viewAllBtn.querySelector('.toggle-icon'), {
                    rotation: 0,
                    duration: 0.3
                }, 0);
            }
        });
    });
}

// Apply parallax effect to the hero section
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition < window.innerHeight) {
        gsap.to('.hero-content', {
            y: scrollPosition * 0.2,
            duration: 0.5,
            ease: "power1.out"
        });
    }
});

// Initialize smooth scrolling for category links
function initSmoothScroll() {
    const categoryLinks = document.querySelectorAll('.category-link');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Expand the target section if it's currently collapsed
                if (targetSection.classList.contains('collapsed')) {
                    const viewAllBtn = targetSection.querySelector('.view-all-btn');
                    if (viewAllBtn) {
                        // Trigger click on the 'View All' button to expand section
                        viewAllBtn.click();
                    }
                }

                // Add smooth scroll to the target section with slight offset to account for fixed header
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('submit-status');

    if (!form || !statusDiv) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        if (!validateForm()) {
            showFormStatus('Please fix the errors above.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual EmailJS call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            showFormStatus('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showFormStatus('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Clear form error messages
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
}

// Validate form fields
function validateForm() {
    let isValid = true;

    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showFieldError('name-error', 'Name is required');
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError('email-error', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showFieldError('email-error', 'Please enter a valid email');
        isValid = false;
    }

    // Message validation
    const message = document.getElementById('message');
    if (!message.value.trim()) {
        showFieldError('message-error', 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError('message-error', 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

// Show field error message
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Show form status message
function showFormStatus(message, type) {
    const statusDiv = document.getElementById('submit-status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        statusDiv.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}
