let currentView = "video";
let previousView = null;

function navigate(view, data = null) {
    previousView = currentView;
    currentView = view;

    if (view === "history") openHistoria();
    else if (view === "history-detail") showHistoria(data);
    else if (view === "home") goHome();
}

function goBack() {
    if (!previousView) return goHome();

    if (previousView === "history") {
        navigate("history");
    } else {
        goHome();
    }
}

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("menuBackdrop");

    if (menu.classList.contains("menu-open")) {
        menu.classList.remove("menu-open");
        menu.classList.add("menu-collapsed");
        backdrop.style.display = "none";
    } else {
        menu.classList.remove("menu-collapsed");
        menu.classList.add("menu-open");
        backdrop.style.display = "block";
    }
}

function closeMenu() {
    const menu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("menuBackdrop");
    menu.classList.remove("menu-open");
    menu.classList.add("menu-collapsed");
    backdrop.style.display = "none";
}