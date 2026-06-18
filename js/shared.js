// DOMContentLoaded: Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins for scroll-based and animation features
    gsap.registerPlugin(ScrollTrigger);

    // Shared animation configurations for use across the site
    const animations = {
        fadeIn: {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        },
        fadeInLeft: {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power2.out'
        },
        fadeInRight: {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power2.out'
        },
        scaleIn: {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        }
    };

    // Menu button hover effect class with standard animations
    class HoverBtn {
        constructor(el) {
            if (!el) return;

            this.btn = el;
            this.txt = this.btn.querySelector(".js-button__text");
            this.hoverTxt = this.btn.querySelector(".js-button__hover");

            // Early return if required elements are missing
            if (!this.txt || !this.hoverTxt) return;

            // Bind methods once in constructor
            this.mouseIn = this.mouseIn.bind(this);
            this.mouseOut = this.mouseOut.bind(this);

            // Skip animation setup if button is active
            if (!this.btn.classList.contains('active')) {
                try {
                    this.setupAnimation();
                } catch (error) {
                    console.error('Error setting up button animation:', error);
                }
            }
        }

        // Setup initial hover text positions with standard animations
        setupAnimation() {
            // Initial setup of hover text positions - changed to match homepage
            gsap.set(this.hoverTxt, {
                y: '100%',
                opacity: 1
            });

            this.addListeners();
        }

        // Mouse enter animation for button
        mouseIn() {
            gsap.to(this.txt, {
                duration: 0.2, // Faster animation to match homepage
                y: '-100%',
                ease: "power2.out",
                overwrite: true
            });

            gsap.to(this.hoverTxt, {
                duration: 0.2, // Faster animation to match homepage
                y: '-100%',
                ease: "power2.out",
                overwrite: true
            });
        }

        // Mouse leave animation for button
        mouseOut() {
            gsap.to(this.txt, {
                duration: 0.2, // Faster animation to match homepage
                y: '0%',
                ease: "power2.out",
                overwrite: true
            });

            gsap.to(this.hoverTxt, {
                duration: 0.2, // Faster animation to match homepage
                y: '0%',
                ease: "power2.out",
                overwrite: true
            });
        }

        // Add mouse event listeners for hover effect
        addListeners() {
            // Always add listeners, let the mouseIn/mouseOut methods handle the state
            this.btn.addEventListener("mouseenter", this.mouseIn);
            this.btn.addEventListener("mouseleave", this.mouseOut);
        }

        // Clean up method to remove event listeners if needed
        destroy() {
            if (this.btn) {
                this.btn.removeEventListener("mouseenter", this.mouseIn);
                this.btn.removeEventListener("mouseleave", this.mouseOut);
            }
        }
    }

    // Initialize hover buttons with error handling
    try {
        const buttons = document.querySelectorAll('.js-button');
        const hoverButtons = new Map(); // Store instances for potential cleanup

        buttons.forEach(el => {
            // Skip hover effects for active-section buttons
            if (el.classList.contains('active-section')) {
                // Apply deactivated grey style
                gsap.set(el, {
                    backgroundColor: '#aaaaaa',
                    scale: 1,
                    color: '#555555',
                    opacity: 0.8
                });

                // Remove all event listeners to prevent any hover changes
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
            } else {
                // Regular hover buttons
                const btn = new HoverBtn(el);
                hoverButtons.set(el, btn);
            }
        });

        // Optional: Cleanup on page unload
        window.addEventListener('unload', () => {
            hoverButtons.forEach(btn => btn.destroy());
            hoverButtons.clear();
        });
    } catch (error) {
        console.error('Error initializing hover buttons:', error);
    }

    // Menu animations with performance optimization
    try {
        const menuLinks = document.querySelectorAll('.main-menu nav a');
        const menuAnimation = {
            enter: {
                scale: 1.1,
                backgroundColor: "white",
                color: "#000",
                duration: 0.2,
                ease: 'power2.out'
            },
            leave: {
                scale: 1,
                backgroundColor: "transparent",
                color: "#fff",
                duration: 0.2,
                ease: 'power2.out'
            },
            activeSection: {
                scale: 1,
                backgroundColor: "#aaaaaa",
                color: "#555555",
                opacity: 0.8,
                duration: 0,
                ease: 'none'
            }
        };

        // Add hover animation to each menu link
        menuLinks.forEach(link => {
            // Apply active section styling immediately and permanently
            if (link.classList.contains('active-section')) {
                // Apply deactivated styling directly
                link.style.backgroundColor = '#aaaaaa';
                link.style.transform = 'scale(1)';
                link.style.color = '#555555';
                link.style.opacity = '0.8';
                link.style.cursor = 'default';

                // Find and style text elements
                const text = link.querySelector('.button__text');
                if (text) {
                    text.style.color = '#555555';
                }

                // Hide hover text
                const hoverText = link.querySelector('.button__hover');
                if (hoverText) {
                    hoverText.style.display = 'none';
                }

                // Remove all event listeners by cloning and replacing
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            } else {
                // Regular hover animations for non-active links
                link.addEventListener('mouseenter', () => gsap.to(link, menuAnimation.enter));
                link.addEventListener('mouseleave', () => gsap.to(link, menuAnimation.leave));
            }
        });

        // Initial animation for menu items with better performance
        gsap.from(menuLinks, {
            y: -10,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power1.out',
            clearProps: 'transform,opacity' // Only clear these properties, keep others
        });
    } catch (error) {
        console.error('Error setting up menu animations:', error);
    }

    // Export shared animations and utilities for other scripts
    window.sharedAnimations = animations;

    // Mobile menu show/hide on scroll
    const mainMenu = document.querySelector('.main-menu');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show/hide menu based on scroll direction (mobile only)
        if (window.innerWidth <= 768) {
            // Only trigger animation when there's significant scroll change
            if (Math.abs(scrollTop - lastScrollTop) > 5) {
                if (scrollTop > lastScrollTop && scrollTop > 60) {
                    requestAnimationFrame(() => {
                        mainMenu.style.transform = 'translateY(-100%)';
                    });
                } else {
                    requestAnimationFrame(() => {
                        mainMenu.style.transform = 'translateY(0)';
                    });
                }
                lastScrollTop = scrollTop;
            }
        }
    }, { passive: true });

    // Initialize mobile menu functionality with enhanced features
    try {
        const hamburger = document.querySelector('.hamburger-menu');
        const mainMenu = document.querySelector('.main-menu');
        const menuLinks = document.querySelectorAll('.main-menu a');

        if (!hamburger || !mainMenu) return;

        // Toggle mobile menu on hamburger click with animation
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mainMenu.classList.contains('mobile-open');

            mainMenu.classList.toggle('mobile-open');

            // Update ARIA attributes for accessibility
            hamburger.setAttribute('aria-expanded', !isOpen);

            // Animate hamburger icon
            const svg = hamburger.querySelector('svg');
            if (svg) {
                gsap.to(svg, {
                    rotation: !isOpen ? 90 : 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            // Stagger animation for menu items
            if (!isOpen) {
                const navLinks = mainMenu.querySelectorAll('.mobile-nav-links a');
                gsap.fromTo(navLinks,
                    { opacity: 0, y: -20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        stagger: 0.1,
                        delay: 0.1,
                        ease: 'power2.out'
                    }
                );
            }
        });

        // Close mobile menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainMenu.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');

                // Reset hamburger icon
                const svg = hamburger.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainMenu.contains(e.target) && mainMenu.classList.contains('mobile-open')) {
                mainMenu.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');

                // Reset hamburger icon
                const svg = hamburger.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }
        });

        // Close mobile menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainMenu.classList.contains('mobile-open')) {
                mainMenu.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus(); // Return focus to hamburger button

                // Reset hamburger icon
                const svg = hamburger.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }
        });

        // Prevent menu close when clicking inside menu
        mainMenu.querySelector('.mobile-nav-links')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
});