// Contact Footer Functionality
document.addEventListener('DOMContentLoaded', function () {
    initContactFooter();
});

// Also initialize on window load to ensure everything is properly loaded
window.addEventListener('load', function () {
    initContactFooter();
});

function initContactFooter() {
    // Make sure contact footer cards are visible
    const contactCards = document.querySelectorAll('.contact-footer-card');
    contactCards.forEach(card => {
        // Force visibility with important flags
        card.style.setProperty('opacity', '1', 'important');
        card.style.setProperty('visibility', 'visible', 'important');
        card.style.display = 'flex';

        // Add visible class
        card.classList.add('card-visible');

        // Remove any transform that might be hiding it
        card.style.transform = 'translateY(0) translateZ(0)';
    });

    // Phone number click to copy functionality
    const phoneCards = document.querySelectorAll('.contact-footer-card:not(a)');

    phoneCards.forEach(card => {
        const phoneLink = card.querySelector('.contact-footer-link');
        if (phoneLink) {
            card.addEventListener('click', function () {
                const phoneNumber = phoneLink.textContent.trim();
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    // Create and show a tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'copy-tooltip';
                    tooltip.textContent = 'Copied to clipboard!';
                    card.appendChild(tooltip);

                    // Remove tooltip after animation
                    setTimeout(() => {
                        tooltip.classList.add('fade-out');
                        setTimeout(() => {
                            tooltip.remove();
                        }, 500);
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        }
    });

    // Simplified hover animations for social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        // Use CSS classes instead of inline styles for better performance
        icon.addEventListener('mouseenter', function () {
            this.classList.add('icon-hover');
        });

        icon.addEventListener('mouseleave', function () {
            this.classList.remove('icon-hover');
        });
    });

    // Use a simpler animation approach without GSAP
    const footer = document.querySelector('.contact-footer');
    if (footer) {
        // Simple fade-in effect when the page loads
        setTimeout(() => {
            const cards = document.querySelectorAll('.contact-footer-card');
            cards.forEach((card, index) => {
                // Stagger the animations slightly
                setTimeout(() => {
                    card.classList.add('card-visible');
                }, index * 80); // Reduced stagger time
            });
        }, 300); // Short delay after page load
    }
} 