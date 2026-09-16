// Prevent browser extension errors
window.addEventListener('error', function (e) {
    if (e.message.includes('message channel closed')) {
        // Suppress browser extension related errors
        e.preventDefault();
        return false;
    }
});

// Wait for the CMS-driven content to finish rendering (js/content-loader.js)
// before setting up animations/interactions, so they run against real
// advice cards instead of an empty/static-fallback container.
document.addEventListener('content:rendered', function () {
    // Hero animation
    gsap.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3
    });

    gsap.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6
    });

    // Animate cards on scroll
    gsap.utils.toArray('.advice-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Mentorship section animation
    gsap.from('.mentorship-text', {
        opacity: 0,
        x: -50,
        duration: 1,
        scrollTrigger: {
            trigger: '.mentorship-section',
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    gsap.from('.mentorship-image', {
        opacity: 0,
        x: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.mentorship-section',
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    // Modal functionality
    const studyModal = document.getElementById('study-modal');
    const modalTitle = document.getElementById('modal-study-title');
    const modalContent = document.getElementById('modal-study-content');
    const modalLink = document.getElementById('modal-full-study');
    const closeModal = document.querySelector('.modal-close');

    // Card link click handlers
    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const studyId = this.getAttribute('data-study');
            // Advice cards are rendered from MongoDB by js/content-loader.js,
            // which registers each one's case study on window.__caseStudies.
            const study = window.__caseStudies && window.__caseStudies[studyId];
            if (!study) return;

            modalTitle.textContent = study.title;
            modalContent.innerHTML = study.content;
            modalLink.setAttribute('href', study.link);

            studyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Mentor CTA button
    document.getElementById('mentor-cta').addEventListener('click', function (e) {
        e.preventDefault();
        // In a real implementation, this would link to a mentor matching page
        alert('Зөвлөх сонгох боломж удахгүй нэмэгдэнэ!');
    });

    // Close modal
    closeModal.addEventListener('click', function () {
        studyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    studyModal.addEventListener('click', function (e) {
        if (e.target === studyModal) {
            studyModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});