/* =========================================
   MOBILE MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {

    navMenu.classList.toggle("active");

});


/* =========================================
   CLOSE MOBILE MENU AFTER CLICK
========================================= */

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navMenu.classList.remove("active");

    });

});


/* =========================================
   CURRENT YEAR
========================================= */

const year = document.getElementById("year");

year.textContent = new Date().getFullYear();


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .skill-card, .project-card, .achievement-card, .timeline-item, .about-text, .about-card, .education-card, .contact-box, .certificates-header, .cert-card"
);

revealElements.forEach(function (element) {

    element.classList.add("reveal");

});


const revealObserver = new IntersectionObserver(

    function (entries, observer) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(function (element) {

    revealObserver.observe(element);

});


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 120;

        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection = section.getAttribute("id");

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================
   CERTIFICATES CAROUSEL SLIDER
========================================= */

(function initCertificatesCarousel() {
    const track = document.getElementById("certTrack");
    const prevBtn = document.getElementById("certPrevBtn");
    const nextBtn = document.getElementById("certNextBtn");
    const pagination = document.getElementById("certPagination");
    const container = document.getElementById("certCarouselContainer");

    if (!track || !prevBtn || !nextBtn || !pagination || !container) return;

    const cards = Array.from(track.querySelectorAll(".cert-card"));
    if (cards.length === 0) return;

    let currentIndex = 0;

    function getVisibleCount() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function getMaxIndex() {
        const visible = getVisibleCount();
        return Math.max(0, cards.length - visible);
    }

    function updatePagination() {
        pagination.innerHTML = "";
        const maxIdx = getMaxIndex();
        const totalDots = maxIdx + 1;

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement("button");
            dot.className = `cert-dot ${i === currentIndex ? "active" : ""}`;
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => {
                goToSlide(i);
            });
            pagination.appendChild(dot);
        }
    }

    function updateCarousel() {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) {
            currentIndex = maxIdx;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        const cardWidth = cards[0].offsetWidth;
        const gap = 24;
        const offset = currentIndex * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIdx;

        // Update dots
        const dots = pagination.querySelectorAll(".cert-dot");
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener("click", () => {
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Touch & Swipe Support
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isSwiping = true;
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener("touchend", () => {
        if (!isSwiping) return;
        const diffX = startX - currentX;
        const threshold = 40;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped Left -> Next
                const maxIdx = getMaxIndex();
                if (currentIndex < maxIdx) {
                    currentIndex++;
                    updateCarousel();
                }
            } else {
                // Swiped Right -> Prev
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
        }
        isSwiping = false;
        startX = 0;
        currentX = 0;
    });

    window.addEventListener("resize", () => {
        updatePagination();
        updateCarousel();
    });

    // Initial setup
    updatePagination();
    updateCarousel();
})();


/* =========================================
   CERTIFICATES MODAL / LIGHTBOX
========================================= */

(function initCertificatesModal() {
    const modal = document.getElementById("certModal");
    const modalBackdrop = document.getElementById("certModalBackdrop");
    const modalClose = document.getElementById("certModalClose");
    const modalImg = document.getElementById("certModalImg");
    const modalTitle = document.getElementById("certModalTitle");
    const modalIssuer = document.getElementById("certModalIssuer");
    const modalDownload = document.getElementById("certModalDownload");

    if (!modal || !modalImg || !modalTitle) return;

    function openModal(title, issuer, imgSrc) {
        modalImg.src = imgSrc;
        modalTitle.textContent = title || "Sertifikat";
        modalIssuer.textContent = issuer || "";
        if (modalDownload) {
            modalDownload.href = imgSrc;
        }
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Attach click to cards
    const cards = document.querySelectorAll(".cert-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const title = card.getAttribute("data-title");
            const issuer = card.getAttribute("data-issuer");
            const img = card.getAttribute("data-img");
            openModal(title, issuer, img);
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
})();