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