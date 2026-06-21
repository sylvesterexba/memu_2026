const { getLocalData, getDataFromApi, saveLocalData, setText, setLabelValue } = ResumeApp;

function renderList(selector, items, visibleCount = 5) {
    const list = document.querySelector(selector);
    if (!list || !Array.isArray(items)) {
        return;
    }

    const wrapper = list.parentElement;
    const existingButton = wrapper.querySelector(`[data-list-toggle="${selector}"]`);
    if (existingButton) {
        existingButton.remove();
    }

    list.textContent = "";
    const validItems = items.filter(Boolean);
    const isExpanded = list.dataset.expanded === "true";
    const visibleItems = isExpanded ? validItems : validItems.slice(0, visibleCount);

    visibleItems.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    if (validItems.length > visibleCount) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "list-more";
        button.dataset.listToggle = selector;
        button.textContent = isExpanded ? "收合" : "查看更多";
        button.addEventListener("click", () => {
            list.dataset.expanded = isExpanded ? "false" : "true";
            renderList(selector, validItems, visibleCount);
        });
        list.insertAdjacentElement("afterend", button);
    }
}

function setupPhotoCarousel(photos) {
    const image = document.querySelector("#profile-photo");
    const prevButton = document.querySelector("#photo-prev");
    const nextButton = document.querySelector("#photo-next");
    const dots = document.querySelector("#photo-dots");
    const validPhotos = Array.isArray(photos) && photos.length ? photos.filter(Boolean) : ["IMG_5952.JPG"];
    let currentIndex = 0;

    if (!image || !prevButton || !nextButton || !dots) {
        return;
    }

    function renderPhoto() {
        image.src = validPhotos[currentIndex];
        dots.textContent = "";

        validPhotos.forEach((photo, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = index === currentIndex ? "carousel-dot active" : "carousel-dot";
            dot.setAttribute("aria-label", `查看第 ${index + 1} 張照片`);
            dot.addEventListener("click", () => {
                currentIndex = index;
                renderPhoto();
            });
            dots.appendChild(dot);
        });
    }

    function move(step) {
        currentIndex = (currentIndex + step + validPhotos.length) % validPhotos.length;
        renderPhoto();
    }

    const hasMultiplePhotos = validPhotos.length > 1;
    prevButton.hidden = !hasMultiplePhotos;
    nextButton.hidden = !hasMultiplePhotos;
    dots.hidden = !hasMultiplePhotos;
    prevButton.onclick = () => move(-1);
    nextButton.onclick = () => move(1);
    renderPhoto();
}

function applyResumeData(data) {
    setText("#resume-summary", data.summary);
    setText("#photo-caption", data.photoCaption);
    setupPhotoCarousel(data.photos);

    // Contact links appear in several responsive layouts, so keep every entry in sync with admin data.
    if (data.profile.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
            link.href = `tel:${data.profile.phone}`;
        });
    }

    if (data.profile.line) {
        document.querySelectorAll('a[href*="line.me"]').forEach((link) => {
            link.href = `https://line.me/ti/p/~${encodeURIComponent(data.profile.line)}`;
        });
    }

    setText("#quick-phone", data.profile.phone);
    setText("#quick-line", data.profile.line);
    setText("#quick-facebook", data.profile.facebook);
    setText("#quick-address", "雙北");
    setText("#profile-name", data.profile.name);
    setText("#profile-phone", data.profile.phone);
    setText("#profile-facebook", data.profile.facebook);
    setText("#profile-line", data.profile.line);
    setText("#profile-area", "雙北／線上");

    renderList("#career-list", data.career, 6);
    renderList("#performance-list", data.performance.performances, 3);
    setText("#performance-sub", data.performance.sub);
    renderList("#artists-list", data.performance.artistList, 12);
    renderList("#awards-list", data.performance.awards, 3);
    setLabelValue("#judge", "評審經歷：", data.performance.judge);
    renderList("#music-room-list", data.teaching.musicRooms, 6);
    renderList("#club-list", data.teaching.clubs, 6);
}

applyResumeData(getLocalData());
getDataFromApi()
    .then((data) => {
        saveLocalData(data);
        applyResumeData(data);
    })
    .catch(() => {});

const backToTopButton = document.querySelector("#back-to-top");

function updateBackToTopButton() {
    if (backToTopButton) {
        backToTopButton.classList.toggle("visible", window.scrollY > 320);
    }
}

if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

window.addEventListener("scroll", updateBackToTopButton, { passive: true });
updateBackToTopButton();

