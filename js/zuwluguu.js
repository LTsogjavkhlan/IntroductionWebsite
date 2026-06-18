// Prevent browser extension errors
window.addEventListener('error', function (e) {
    if (e.message.includes('message channel closed')) {
        // Suppress browser extension related errors
        e.preventDefault();
        return false;
    }
});

// Initialize page animations and interactions
document.addEventListener('DOMContentLoaded', function () {
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

    // Make sure contact footer connects smoothly with mentorship section
    const contactFooter = document.querySelector('.contact-footer');
    if (contactFooter) {
        contactFooter.style.marginTop = '0';
        contactFooter.style.paddingTop = '3rem';
    }

    // Modal functionality
    const studyModal = document.getElementById('study-modal');
    const modalTitle = document.getElementById('modal-study-title');
    const modalContent = document.getElementById('modal-study-content');
    const modalLink = document.getElementById('modal-full-study');
    const closeModal = document.querySelector('.modal-close');

    // Study data (would normally come from an API)
    const studies = {
        'career-study': {
            title: 'Career Development Case Studies',
            content: '<p>Our research shows that professionals who engage in structured career planning are 3x more likely to achieve their career goals within 5 years. This study examines the strategies used by successful professionals across various industries.</p><p>Key findings include the importance of continuous learning, networking, and setting measurable milestones.</p>',
            link: '#career-full-study'
        },
        'skill-study': {
            title: 'Skill Building Research',
            content: '<p>This comprehensive study analyzes the most in-demand skills across industries and how professionals can effectively acquire them. We followed 500 participants through their skill development journeys.</p><p>The data reveals that targeted, project-based learning yields the best long-term retention and application of new skills.</p>',
            link: '#skill-full-study'
        },
        'network-study': {
            title: 'Networking Success Stories',
            content: '<p>Explore real-world examples of professionals who transformed their careers through strategic networking. These case studies highlight different approaches to building meaningful professional relationships.</p><p>Common themes include the value of mentorship, attending industry events, and maintaining genuine connections.</p>',
            link: '#network-full-study'
        }
    };

    // Card link click handlers
    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const studyId = this.getAttribute('data-study');
            const study = studies[studyId];

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
        alert('Mentor matching functionality would be implemented here!');
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