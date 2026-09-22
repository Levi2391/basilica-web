const IMAGE_DURATION_MS = 30000;
const ADVERTISEMENTS_DIR = "advertisements";
const MANIFEST_URL = `${ADVERTISEMENTS_DIR}/manifest.json`;
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v"]);

function getMediaType(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    return VIDEO_EXTENSIONS.has(ext) ? "video" : "image";
}

const slideshow = (() => {
    let items = [];
    let currentIndex = 0;
    let imageTimer = null;
    let paused = false;
    let imageEl, videoEl, progressEl;

    function startProgress(durationSeconds) {
        progressEl.style.animation = "none";
        void progressEl.offsetWidth;
        progressEl.style.animation = `slide-progress-fill ${durationSeconds}s linear forwards`;
    }

    function stopProgress() {
        progressEl.style.animation = "none";
        progressEl.style.width = "0%";
    }

    function showCurrent() {
        if (items.length === 0) return;

        clearTimeout(imageTimer);
        videoEl.pause();
        videoEl.style.display = "none";
        imageEl.style.display = "none";
        stopProgress();

        const item = items[currentIndex];
        const src = `${ADVERTISEMENTS_DIR}/${item.file}`;

        if (item.type === "video") {
            videoEl.src = src;
            videoEl.style.display = "block";
            videoEl.currentTime = 0;
            videoEl.addEventListener("loadedmetadata", () => startProgress(videoEl.duration), { once: true });
            videoEl.play().catch(advance);
        } else {
            imageEl.src = src;
            imageEl.style.display = "block";
            startProgress(IMAGE_DURATION_MS / 1000);
            imageTimer = setTimeout(advance, IMAGE_DURATION_MS);
        }
    }

    function advance() {
        if (paused || items.length === 0) return;
        currentIndex = (currentIndex + 1) % items.length;
        showCurrent();
    }

    function pause() {
        paused = true;
        clearTimeout(imageTimer);
        videoEl.pause();
        progressEl.style.animationPlayState = "paused";
    }

    function resume() {
        if (!paused) return;
        paused = false;
        showCurrent();
    }

    async function init() {
        imageEl = document.getElementById("slideImage");
        videoEl = document.getElementById("slideVideo");
        progressEl = document.getElementById("slideProgress");

        videoEl.addEventListener("ended", advance);
        videoEl.addEventListener("error", advance);
        imageEl.addEventListener("error", advance);

        try {
            const res = await fetch(MANIFEST_URL);
            const files = await res.json();
            items = files.map(file => ({ file, type: getMediaType(file) }));
        } catch (e) {
            items = [];
        }

        showCurrent();
    }

    document.addEventListener("DOMContentLoaded", init);

    return { pause, resume };
})();
