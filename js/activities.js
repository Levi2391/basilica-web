async function loadActividadesHTML() {
    const url = "https://docs.google.com/spreadsheets/d/11ELfVYBj_gTDtBdRlTkZjd-T9c2YB-Y_e24d-Wa7jU4/gviz/tq?tqx=out:json";

    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const rows = json.table.rows;
    const container = document.getElementById("actividadesContainer");

    const parsed = parseActivities(rows);
    const futureActs = filterFutureActivities(parsed);
    const grouped = groupActivitiesByDate(futureActs);
    const sortedDates = getSortedDates(grouped);

    renderActivities(container, grouped, sortedDates);
}

// Helper to check if two dates are the same day (ignoring time)
function isSameDay(date1, date2 = new Date()) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// Parse raw Google Sheets data into structured activities
function parseActivities(sheetData) {
    const activities = [];

    sheetData.forEach(row => {
        const [tituloCell, fechaCell, horaCell, descripcionCell, imagenCell] = row.c;

        if (!tituloCell || !fechaCell) return;

        // Extract date from formatted field if available
        const fechaStr = fechaCell.f || fechaCell.v; // "2026-03-27"
        const horaStr = horaCell.f || horaCell.v;   // "10:00"

        // Split date and time into numbers
        const [y, m, d] = fechaStr.split("-").map(Number);
        const [h = 0, min = 0] = (horaStr || "00:00").split(":").map(Number);

        const dateObj = new Date(y, m - 1, d, h, min);

        activities.push({
            titulo: tituloCell.v,
            fecha: fechaStr,
            hora: horaStr,
            descripcion: descripcionCell ? descripcionCell.v : "",
            imagen: imagenCell ? imagenCell.v : "",
            dateObj // store Date object for filtering/sorting
        });
    });

    return activities;
}

function renderActivities(container, grouped, sortedDates) {
    container.innerHTML = `
        <h1 class="text-6xl font-bold mb-12 text-center">
            Actividades y Eventos
        </h1>
    `;

    sortedDates.forEach(fechaStr => {
        const acts = grouped[fechaStr];
        const [y, m, d] = fechaStr.split("-");
        const dateObj = new Date(y, m - 1, d);
        const isToday = isSameDay(dateObj);

        const section = document.createElement("div");
        section.innerHTML = `
            <h2 class="section-title ${isToday ? "today" : ""}">
                ${formatFechaCorta(fechaStr)}
                ${isToday ? " (HOY)" : ""}
            </h2>
        `;

        acts.forEach(act => {
            const card = document.createElement("div");
            const hasExtra = act.descripcion || act.imagen;

            card.className = `card ${isToday ? "today" : ""} ${hasExtra ? "hoverable" : ""}`;

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <h3 class="card-title">${act.titulo}</h3>
                    <div class="flex items-center gap-4">
                        <span class="card-time">${act.hora || ""}</span>
                        ${hasExtra ? `<span class="arrow">▼</span>` : ""}
                    </div>
                </div>
                ${hasExtra ? `
                    <div class="card-body" style="max-height:0px; overflow:hidden; transition:max-height 0.3s ease;">
                        ${act.imagen ? `<img src="${act.imagen}" class="w-full rounded-xl mb-4">` : ""}
                        ${act.descripcion ? `<p>${act.descripcion}</p>` : ""}
                    </div>
                ` : ""}
            `;

            if (hasExtra) {
                card.addEventListener("click", (e) => {
                    if (e.target.closest(".card-body")) return;

                    const body = card.querySelector(".card-body");
                    const arrow = card.querySelector(".arrow");
                    const isOpen = body.classList.contains("open");

                    if (isOpen) {
                        body.style.maxHeight = "0px";
                        body.classList.remove("open");
                        arrow.style.transform = "rotate(0deg)";
                    } else {
                        body.style.maxHeight = body.scrollHeight + "px";
                        body.classList.add("open");
                        arrow.style.transform = "rotate(180deg)";
                    }
                });
            }

            section.appendChild(card);
        });

        container.appendChild(section);
    });
}

function sortActivities(activities) {
    return activities.sort((a, b) => a.fecha - b.fecha);
}

function groupByDate(activities) {
    const grouped = {};
    activities.forEach(act => {
        if (!grouped[act.fechaKey]) grouped[act.fechaKey] = [];
        grouped[act.fechaKey].push(act);
    });
    return grouped;
}

function sortDates(grouped) {
    const keys = Object.keys(grouped);
    return keys.sort((a, b) => {
        const da = new Date(a), db = new Date(b);
        if (isSameDay(da)) return -1;
        if (isSameDay(db)) return 1;
        return da - db;
    });
}

// Get sorted list of dates for rendering
function getSortedDates(grouped) {
    return Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
}

function isSameDay(date) {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
}

function formatFechaCorta(fechaStr) {
    const date = new Date(fechaStr);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeDate(fecha) {
    // fecha is a Date object
    return fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1).padStart(2, '0') + "-" +
        String(fecha.getDate()).padStart(2, '0');
}

// Filter future activities (today always included)
function filterFutureActivities(activities) {
    const now = new Date();
    return activities.filter(act => {
        // Always include today
        if (isSameDay(act.dateObj, now)) return true;

        // Include future dates
        return act.dateObj > now;
    });
}

// Group activities by date for rendering
function groupActivitiesByDate(activities) {
    const grouped = {};
    activities.forEach(act => {
        if (!grouped[act.fecha]) grouped[act.fecha] = [];
        grouped[act.fecha].push(act);
    });

    // Sort activities within each day by hour
    Object.keys(grouped).forEach(fecha => {
        grouped[fecha].sort((a, b) => a.dateObj - b.dateObj);
    });

    return grouped;
}

function openActividades() {
    removeHistoriaButtons();
    document.getElementById("panel").style.display = "block";
    document.getElementById("mainVideo").pause();

    const container = document.getElementById("actividadesContainer");
    container.classList.remove("hidden");
    container.style.display = "block";
    container.innerHTML = `Cargando...`;

    currentView = "actividades";

    loadActividadesHTML();
}

setTimeout(() => {
    loadActividadesHTML();
}, 50);