// Fetches this page's content from the CMS API and renders it into the
// existing static markup (which stays as a fallback if the fetch fails).
// Fires 'content:rendered' when done (success or failure) so each page's
// own script can safely set up carousels/animations/galleries afterward.
(function () {
    const PAGE = document.body.dataset.page;
    if (!PAGE) return;

    const HERO_BODY_SELECTOR = { home: '.slide-content p', td: '.hero-subtitle', surgalt: '.hero-description', zuwluguu: '.hero-subtitle' };

    function renderSimpleHero(slide) {
        if (!slide) return;
        const heroSection = document.querySelector('.hero-section');
        const titleEl = document.querySelector('.hero-title');
        const bodyEl = document.querySelector(HERO_BODY_SELECTOR[PAGE]);
        if (titleEl) titleEl.textContent = slide.title;
        if (bodyEl) bodyEl.textContent = slide.body;
        if (heroSection && slide.imageUrl) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${slide.imageUrl}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }

    function buildSlideEl(slide, index) {
        const div = document.createElement('div');
        div.className = 'slide' + (index === 0 ? ' active' : '');
        div.dataset.index = String(index);
        div.setAttribute('role', 'group');
        div.setAttribute('aria-label', `${slide.title} slide`);

        const content = document.createElement('div');
        content.className = 'slide-content';

        const h1 = document.createElement('h1');
        if (index === 0) h1.id = 'hero-title';
        h1.textContent = slide.title;
        content.appendChild(h1);

        const p = document.createElement('p');
        p.textContent = slide.body;
        content.appendChild(p);

        if (slide.ctaLabel) {
            const ctaWrap = document.createElement('div');
            ctaWrap.className = 'hero-cta';
            ctaWrap.innerHTML = `
                <div class="button-wrap">
                    <button type="button" aria-label="${escapeHtml(slide.ctaLabel)}"><span>${escapeHtml(slide.ctaLabel)}</span></button>
                    <div class="button-shadow" aria-hidden="true"></div>
                </div>`;
            ctaWrap.querySelector('button').addEventListener('click', () => {
                if (slide.ctaLink) window.location.href = slide.ctaLink;
            });
            content.appendChild(ctaWrap);
        }

        div.appendChild(content);

        const bg = document.createElement('div');
        bg.className = 'slide-bg';
        bg.innerHTML = `<img src="${escapeHtml(slide.imageUrl)}" data-src="${escapeHtml(slide.imageUrl)}" alt="${escapeHtml(slide.imageAlt)}" class="lazy-load slide-bg-img" loading="${index === 0 ? 'eager' : 'lazy'}">`;
        div.appendChild(bg);

        return div;
    }

    function renderHomeHero(slides) {
        const container = document.querySelector('.slider-container');
        if (!container || !slides.length) return;

        container.querySelectorAll('.slide').forEach((el) => el.remove());
        const navArea = container.querySelector('.slider-nav-area');
        slides.forEach((slide, i) => {
            const el = buildSlideEl(slide, i);
            if (navArea) container.insertBefore(el, navArea);
            else container.appendChild(el);
        });

        const indicators = container.querySelector('.slide-indicators');
        if (indicators) {
            indicators.innerHTML = slides.map((slide, i) =>
                `<button class="indicator${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}: ${escapeHtml(slide.title)}" type="button"></button>`
            ).join('');
        }
    }

    function renderCategories(categories) {
        const container = document.querySelector('.categories-container');
        if (!container) return;
        container.innerHTML = categories.map((cat, i) => `
            <div class="category-card" role="article" aria-labelledby="cat${i}-title">
                <div class="category-icon" role="img" aria-label="${escapeHtml(cat.title)} icon">
                    <img src="${escapeHtml(cat.iconUrl)}" alt="${escapeHtml(cat.iconAlt)}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <h3 id="cat${i}-title" class="category-title">${escapeHtml(cat.title)}</h3>
                <p class="category-description">${escapeHtml(cat.description)}</p>
                <a href="#${escapeHtml(cat.linkSectionId)}" class="category-link" aria-describedby="cat${i}-title">${escapeHtml(cat.linkText)}</a>
            </div>
        `).join('');
    }

    function courseCardHtml(course) {
        const badgeHtml = course.badge && course.badge !== 'none'
            ? `<div class="course-badge${course.badge === 'new' ? ' new' : ''}"${course.badge === 'popular' ? ' aria-label="Popular course"' : ''}>${course.badge === 'new' ? 'New' : 'Popular'}</div>`
            : '';
        return `
            <div class="course-card" data-categories="all ${course.badge !== 'none' ? escapeHtml(course.badge) : ''}">
                <div class="course-image">
                    <img src="${escapeHtml(course.imageUrl)}" alt="${escapeHtml(course.imageAlt)}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
                    ${badgeHtml}
                </div>
                <div class="course-content">
                    <div class="course-meta"><span class="course-category">${escapeHtml(course.categoryLabel)}</span></div>
                    <h3 class="course-title">${escapeHtml(course.title)}</h3>
                    <p class="course-description">${escapeHtml(course.description)}</p>
                    <a href="${escapeHtml(course.linkHref)}" class="course-link">${escapeHtml(course.linkText)}</a>
                </div>
            </div>`;
    }

    function renderCourseSections(sections, courses) {
        const container = document.getElementById('course-sections-container');
        if (!container) return;

        container.innerHTML = sections.map((section) => {
            const sectionCourses = courses.filter((c) => c.sectionId === section.sectionId);
            return `
                <section id="${escapeHtml(section.sectionId)}" class="courses-section collapsed${section.colorVariant ? ' ' + escapeHtml(section.colorVariant) : ''}" aria-labelledby="${escapeHtml(section.sectionId)}-title">
                    <div class="container">
                        <div class="section-header">
                            <h2 id="${escapeHtml(section.sectionId)}-title" class="section-title">${escapeHtml(section.title)}</h2>
                            <button class="view-all-btn" aria-expanded="false" aria-controls="${escapeHtml(section.sectionId)}-list" type="button">
                                <span class="btn-text">Бүгдийг харах</span>
                                <span class="toggle-icon" aria-hidden="true">+</span>
                            </button>
                        </div>
                        <p class="section-description">${escapeHtml(section.description)}</p>
                        <div id="${escapeHtml(section.sectionId)}-list" class="course-cards-container" role="grid" aria-label="${escapeHtml(section.title)}">
                            ${sectionCourses.map(courseCardHtml).join('')}
                        </div>
                    </div>
                </section>`;
        }).join('');
    }

    function renderProducts(products) {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;

        window.__productGalleries = {};
        products.forEach((p) => {
            window.__productGalleries[`product-${p._id}`] = (p.images || []).map((img) => img.url);
        });

        grid.innerHTML = products.map((p) => {
            const img = p.images && p.images[0];
            return `
                <div class="product-card" data-category="${escapeHtml(p.category)}">
                    <div class="product-image" data-product="product-${p._id}">
                        <img src="${escapeHtml(img ? img.url : '')}" alt="${escapeHtml(img ? img.alt : p.title)}" loading="lazy">
                        <div class="gallery-overlay" aria-hidden="true">
                            <div class="gallery-icon">🖼️</div>
                            <div class="gallery-text">Илүү олон зураг үзэх</div>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${escapeHtml(p.title)}</h3>
                        <div class="product-price">${escapeHtml(p.price)}</div>
                        <div class="product-description">
                            <p>${escapeHtml(p.description)}</p>
                            <div class="product-features">${(p.features || []).map((f) => `<span class="feature">${escapeHtml(f)}</span>`).join('')}</div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    function renderAdviceCards(cards) {
        const container = document.querySelector('.advice-cards');
        if (!container) return;

        window.__caseStudies = {};
        cards.forEach((card, i) => {
            window.__caseStudies[`card-${i}`] = { title: card.studyTitle, content: card.studyContent, link: card.studyLink };
        });

        container.innerHTML = cards.map((card, i) => `
            <div class="advice-card">
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${card.iconSvgPath}"></path></svg>
                </div>
                <h3 class="card-title">${escapeHtml(card.title)}</h3>
                <p class="card-content">${escapeHtml(card.content)}</p>
                <a href="#" class="card-link" data-study="card-${i}">${escapeHtml(card.linkText)}</a>
            </div>
        `).join('');
    }

    function renderTdTeaser(products) {
        const grid = document.getElementById('td-teaser-grid');
        if (!grid || !products.length) return;
        grid.innerHTML = products.slice(0, 3).map((p) => {
            const img = p.images && p.images[0];
            return `
                <a href="TD.html" class="teaser-card" role="listitem">
                    <div class="teaser-image">
                        <img src="${escapeHtml(img ? img.url : '')}" alt="${escapeHtml(img ? img.alt : p.title)}" loading="lazy">
                    </div>
                    <div class="teaser-info">
                        <h3 class="teaser-title">${escapeHtml(p.title)}</h3>
                        <p class="teaser-price">${escapeHtml(p.price)}</p>
                    </div>
                </a>`;
        }).join('');
    }

    function renderSurgaltTeaser(courses) {
        const grid = document.getElementById('surgalt-teaser-grid');
        if (!grid || !courses.length) return;
        grid.innerHTML = courses.slice(0, 3).map((c) => `
            <a href="surgalt.html" class="teaser-card" role="listitem">
                <div class="teaser-image">
                    <img src="${escapeHtml(c.imageUrl)}" alt="${escapeHtml(c.imageAlt)}" loading="lazy">
                </div>
                <div class="teaser-info">
                    <span class="teaser-category">${escapeHtml(c.categoryLabel)}</span>
                    <h3 class="teaser-title">${escapeHtml(c.title)}</h3>
                </div>
            </a>`).join('');
    }

    function renderZuwluguuTeaser(cards) {
        const grid = document.getElementById('zuwluguu-teaser-grid');
        if (!grid || !cards.length) return;
        grid.innerHTML = cards.slice(0, 3).map((card) => `
            <a href="zuwluguu.html" class="teaser-card teaser-card-advice" role="listitem">
                <div class="teaser-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${card.iconSvgPath}"></path></svg>
                </div>
                <h3 class="teaser-title">${escapeHtml(card.title)}</h3>
                <p class="teaser-desc">${escapeHtml(card.content)}</p>
            </a>`).join('');
    }

    async function fetchPageContent(page) {
        try {
            const response = await fetch(`/api/content/${page}`);
            const json = await response.json();
            return json.success ? json : null;
        } catch (error) {
            console.error(`Failed to load CMS content for ${page}:`, error);
            return null;
        }
    }

    async function loadContent() {
        let data;

        if (PAGE === 'home') {
            const [home, td, surgalt, zuwluguu] = await Promise.all([
                fetchPageContent('home'),
                fetchPageContent('td'),
                fetchPageContent('surgalt'),
                fetchPageContent('zuwluguu'),
            ]);
            data = home;
            if (home) renderHomeHero(home.hero);
            if (td) renderTdTeaser(td.products);
            if (surgalt) renderSurgaltTeaser(surgalt.courses);
            if (zuwluguu) renderZuwluguuTeaser(zuwluguu.adviceCards);
        } else {
            data = await fetchPageContent(PAGE);
            if (data) {
                renderSimpleHero(data.hero[0]);
                if (PAGE === 'surgalt') {
                    renderCategories(data.categories);
                    renderCourseSections(data.sections, data.courses);
                } else if (PAGE === 'td') {
                    renderProducts(data.products);
                } else if (PAGE === 'zuwluguu') {
                    renderAdviceCards(data.adviceCards);
                }
            }
        }

        document.dispatchEvent(new CustomEvent('content:rendered', { detail: data }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
})();
