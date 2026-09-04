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
   CERTIFICATES CAROUSEL & FILTER
========================================= */

(function initCertificates() {
    const track = document.getElementById("certTrack");
    const prevBtn = document.getElementById("certPrevBtn");
    const nextBtn = document.getElementById("certNextBtn");
    const pagination = document.getElementById("certPagination");
    const container = document.getElementById("certCarouselContainer");
    const filterBtns = document.querySelectorAll(".cert-filter-btn");

    if (!track || !prevBtn || !nextBtn || !pagination || !container) return;

    const allCards = Array.from(track.querySelectorAll(".cert-card"));
    if (allCards.length === 0) return;

    let currentIndex = 0;
    let currentFilter = "all";

    // Update filter counts dynamically
    const countAllEl = document.getElementById("countAll");
    const countImgEl = document.getElementById("countImg");
    const countPdfEl = document.getElementById("countPdf");

    if (countAllEl) countAllEl.textContent = allCards.length;
    if (countImgEl) {
        countImgEl.textContent = allCards.filter(c => c.getAttribute("data-type") === "image" || c.getAttribute("data-img")).length;
    }
    if (countPdfEl) {
        countPdfEl.textContent = allCards.filter(c => c.getAttribute("data-type") === "pdf" || c.getAttribute("data-pdf")).length;
    }

    function getVisibleCards() {
        return allCards.filter(card => !card.classList.contains("hidden"));
    }

    function getVisibleCount() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function getMaxIndex() {
        const visibleCards = getVisibleCards();
        const visibleCount = getVisibleCount();
        return Math.max(0, visibleCards.length - visibleCount);
    }

    function updatePagination() {
        pagination.innerHTML = "";
        const maxIdx = getMaxIndex();
        const visibleCards = getVisibleCards();

        if (visibleCards.length <= getVisibleCount()) {
            pagination.style.display = "none";
            return;
        }
        pagination.style.display = "flex";

        const totalDots = maxIdx + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement("button");
            dot.className = `cert-dot ${i === currentIndex ? "active" : ""}`;
            dot.setAttribute("aria-label", `Ke sertifikat ${i + 1}`);
            dot.addEventListener("click", () => {
                goToSlide(i);
            });
            pagination.appendChild(dot);
        }
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIdx = getMaxIndex();

        if (currentIndex > maxIdx) {
            currentIndex = maxIdx;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        if (visibleCards.length === 0) {
            track.style.transform = `translateX(0px)`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        const firstCard = visibleCards[0];
        const cardWidth = firstCard ? firstCard.offsetWidth : 0;
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

    // Filter Button Clicks
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter") || "all";

            allCards.forEach(card => {
                const type = card.getAttribute("data-type") || "image";
                const hasPdf = !!card.getAttribute("data-pdf");
                const hasImg = !!card.getAttribute("data-img");

                let matches = false;
                if (currentFilter === "all") {
                    matches = true;
                } else if (currentFilter === "image") {
                    matches = type === "image" || hasImg;
                } else if (currentFilter === "pdf") {
                    matches = type === "pdf" || hasPdf;
                }

                if (matches) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });

            currentIndex = 0;
            updatePagination();
            updateCarousel();
        });
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
   CERTIFICATES MODAL (IMAGE & PDF VIEWER)
========================================= */

(function initCertificatesModal() {
    const modal = document.getElementById("certModal");
    const modalBackdrop = document.getElementById("certModalBackdrop");
    const modalClose = document.getElementById("certModalClose");

    const modalTabs = document.getElementById("certModalTabs");
    const tabImgBtn = document.getElementById("certTabImgBtn");
    const tabPdfBtn = document.getElementById("certTabPdfBtn");

    const imgBox = document.getElementById("certModalImgBox");
    const pdfBox = document.getElementById("certModalPdfBox");
    const modalImg = document.getElementById("certModalImg");
    const modalPdf = document.getElementById("certModalPdf");

    const modalBadge = document.getElementById("certModalBadge");
    const modalTitle = document.getElementById("certModalTitle");
    const modalIssuer = document.getElementById("certModalIssuer");

    const openBtn = document.getElementById("certModalOpenNewTab");
    const openText = document.getElementById("certModalOpenText");
    const downloadBtn = document.getElementById("certModalDownload");
    const downloadText = document.getElementById("certModalDownloadText");

    if (!modal || !modalTitle) return;

    let currentCardData = null;

    function setViewMode(mode) {
        if (mode === "pdf") {
            if (imgBox) imgBox.style.display = "none";
            if (pdfBox) pdfBox.style.display = "flex";
            if (tabPdfBtn) tabPdfBtn.classList.add("active");
            if (tabImgBtn) tabImgBtn.classList.remove("active");

            if (modalPdf && currentCardData && currentCardData.pdf) {
                modalPdf.src = currentCardData.pdf;
            }

            if (modalBadge) {
                modalBadge.textContent = "DOKUMEN RESMI (PDF)";
                modalBadge.classList.add("badge-pdf");
            }

            if (openBtn && currentCardData && currentCardData.pdf) {
                openBtn.href = currentCardData.pdf;
                if (openText) openText.textContent = "Buka PDF di Tab Baru";
            }
            if (downloadBtn && currentCardData && currentCardData.pdf) {
                downloadBtn.href = currentCardData.pdf;
                if (downloadText) downloadText.textContent = "Unduh Dokumen PDF";
            }
        } else {
            if (imgBox) imgBox.style.display = "flex";
            if (pdfBox) pdfBox.style.display = "none";
            if (tabImgBtn) tabImgBtn.classList.add("active");
            if (tabPdfBtn) tabPdfBtn.classList.remove("active");

            if (modalImg && currentCardData && currentCardData.img) {
                modalImg.src = currentCardData.img;
            }

            if (modalBadge) {
                modalBadge.textContent = "GAMBAR SERTIFIKAT";
                modalBadge.classList.remove("badge-pdf");
            }

            if (openBtn && currentCardData && currentCardData.img) {
                openBtn.href = currentCardData.img;
                if (openText) openText.textContent = "Buka Gambar Penuh";
            }
            if (downloadBtn && currentCardData && currentCardData.img) {
                downloadBtn.href = currentCardData.img;
                if (downloadText) downloadText.textContent = "Unduh Gambar";
            }
        }
    }

    function openModal(data) {
        currentCardData = data;
        modalTitle.textContent = data.title || "Sertifikat";
        modalIssuer.textContent = data.issuer || "";

        const hasImg = !!data.img;
        const hasPdf = !!data.pdf;

        // Determine if tabs are needed
        if (hasImg && hasPdf) {
            if (modalTabs) modalTabs.style.display = "inline-flex";
            // default to image unless specified
            setViewMode(data.type === "pdf" ? "pdf" : "image");
        } else {
            if (modalTabs) modalTabs.style.display = "none";
            if (hasPdf || data.type === "pdf") {
                setViewMode("pdf");
            } else {
                setViewMode("image");
            }
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Reset iframe src to unload PDF
        if (modalPdf) modalPdf.src = "";
    }

    // Modal tabs listeners
    if (tabImgBtn) {
        tabImgBtn.addEventListener("click", () => setViewMode("image"));
    }
    if (tabPdfBtn) {
        tabPdfBtn.addEventListener("click", () => setViewMode("pdf"));
    }

    // Attach click event to all certificate cards
    const cards = document.querySelectorAll(".cert-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const title = card.getAttribute("data-title");
            const issuer = card.getAttribute("data-issuer");
            const img = card.getAttribute("data-img");
            const pdf = card.getAttribute("data-pdf");
            const type = card.getAttribute("data-type") || (pdf ? "pdf" : "image");

            openModal({ title, issuer, img, pdf, type });
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