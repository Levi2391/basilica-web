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

    const res = await fetch("components/historia-menu.html");
    const menuHTML = await res.text();

    const menuDiv = container.querySelector("#historiaMenu");

    if (menuDiv) {
        menuDiv.innerHTML = menuHTML;
    } else {
        container.innerHTML += menuHTML;
    }

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
        <h1 class="text-5xl my-10">
            ${section.title}
        </h1>

        ${section.content.map(block => {

            // 📌 Texto simple
            if (block.type === "paragraph") {
                return `<p class="mb-12">${block.p}</p>`;
            }

            // 📌 Texto + imagen
            if (block.type === "text-image") {
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 items-center">
                        <p>${block.p}</p>
                        <img src="${block.img}" class="w-full rounded-lg">
                    </div>
                `;
            }

            // 📌 Imagen + texto
            if (block.type === "image-text") {
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 items-center">
                        <img src="${block.img}" class="w-full rounded-lg">
                        <p>${block.p}</p>
                    </div>
                `;
            }

            // 📌 Imagen sola
            if (block.type === "image") {
                return `
                    <img 
                        src="${block.img}" 
                        class="w-full mb-12 rounded-lg"
                    >
                `;
            }

          // 📌 Accordion
if (block.type === "accordion") {
    return `
        <div class="mb-12">
            ${block.items.map(item => `
                <details class="border border-gray-300 rounded-lg p-4 mb-4 bg-white/5">
                    <summary class="cursor-pointer font-bold text-lg">
                        ${item.title}
                    </summary>

                    <div class="mt-4 leading-relaxed whitespace-pre-line">
                        ${item.content}
                    </div>
                </details>
            `).join("")}
        </div>
    `;
}

            return "";

        }).join("")}
    `;
}
