function hideAllViews() {
    document.querySelectorAll(".view-container")
        .forEach(c => c.style.display = "none");
}

function showPanel(mode = "grid") {
    const panel = document.getElementById("panel");
    panel.style.display = mode;
    document.getElementById("mainVideo").pause();
}

function goHome() {
    hideAllViews();
    document.getElementById("panel").style.display = "none";
    document.getElementById("mainVideo").play();
    currentView = "video";
}