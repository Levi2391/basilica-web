async function openHistoria() {
    currentView = "history";
    showPanel("grid");
    hideAllViews();

    const container = document.getElementById("historia-container");
    container.style.display = "grid";

    if (!translations.history) {
        console.error("Translations not loaded yet");
        return;
    }

    // 🔥 1. Pintamos título + intro primero
    const { title, intro } = translations.history;

    container.innerHTML = `
        <div class="history-header mb-10">
            <h1 class="text-5xl font-bold mb-6">
                ${title}
            </h1>

            <p class="text-lg opacity-90">
                ${intro}
            </p>
        </div>

        <div id="historiaMenu"></div>
    `;

    // 🔥 2. Insertamos el menú HTML dentro del contenedor
    const res = await fetch("components/historia-menu.html");
    const menuHTML = await res.text();

    const menuDiv = container.querySelector("#historiaMenu");
    if (menuDiv) {
        menuDiv.innerHTML = menuHTML;
    } else {
        console.warn("historiaMenu container not found");
        container.innerHTML += menuHTML;
    }

    // 🔥 3. Render lógico del menú (clicks, etc.)
    renderHistoriaMenu(container);

    updateLangUI();
}


function showHistoria(sectionId) {
    currentView = `history-detail-${sectionId}`;

    const container = document.getElementById("historia-container");
    const section = translations.history.sections[sectionId];

    if (!section) {
        container.innerHTML = "<p>Sección no encontrada</p>";
        return;
    }

    container.innerHTML = `
        <button class="backBtn shadow-md mb-6" onclick="openHistoria()">
            ← VOLVER
        </button>

        <h1 class="text-5xl my-10">
            ${section.title}
        </h1>

        ${section.content.map(block => {

            if (block.type === "paragraph") {
                return `<p class="mb-12">${block.p}</p>`;
            }

            if (block.type === "text-image") {
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 items-center">
                        <p>${block.p}</p>
                        <img src="${block.img}" class="w-full">
                    </div>
                `;
            }

            if (block.type === "image-text") {
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 items-center">
                        <img src="${block.img}" class="w-full">
                        <p>${block.p}</p>
                    </div>
                `;
            }

            if (block.type === "image") {
                return `<img src="${block.img}" class="w-full mb-12">`;
            }

            return "";
        }).join("")}
    `;
}
