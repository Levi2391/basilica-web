// Kiosk runs as an installed fullscreen PWA with no address bar, no
// pull-to-refresh and (once Screen Pinning is on) no back button - there is
// no way for anyone to manually reload it after a new GitHub Pages deploy.
// This polls the page's own ETag/Last-Modified and reloads once a change is
// seen, deferring the reload until the kiosk is idle so it doesn't interrupt
// someone mid-navigation.

const AUTO_UPDATE_POLL_MS = 10 * 60 * 1000; // matches GitHub Pages' own CDN cache-control max-age

let autoUpdateBaseline = null;
let autoUpdateAvailable = false;

async function fetchPageRevision() {
    const res = await fetch(location.href, { method: "HEAD", cache: "no-store" });
    return res.headers.get("etag") || res.headers.get("last-modified");
}

async function checkForUpdate() {
    try {
        const revision = await fetchPageRevision();
        if (!revision) return;

        if (autoUpdateBaseline === null) {
            autoUpdateBaseline = revision;
            return;
        }

        if (revision !== autoUpdateBaseline) {
            autoUpdateAvailable = true;
            maybeApplyUpdate();
        }
    } catch (err) {
        // Offline or request blocked - try again next cycle, kiosk keeps running on the current version.
        console.warn("auto-update check failed:", err);
    }
}

function maybeApplyUpdate() {
    if (autoUpdateAvailable && currentView === "video") {
        location.reload();
    }
}

checkForUpdate();
setInterval(checkForUpdate, AUTO_UPDATE_POLL_MS);

// currentView only flips back to "video" through goHome()/the inactivity
// timer - catch that moment instead of waiting for the next poll tick.
setInterval(maybeApplyUpdate, 5000);
