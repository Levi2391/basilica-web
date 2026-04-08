async function openHistoria() {
    currentView = "history";
    showPanel("grid");
    hideAllViews();

    const container = document.getElementById("historia-container");
    container.style.display = "grid";

    const res = await fetch("components/historia-menu.html");
    container.innerHTML = await res.text();

    const menuDiv = container.querySelector("#historiaMenu");
    if (!menuDiv) {
        container.innerHTML = '<div id="historiaMenu"></div>';
    }

    if (!translations.history) {
        console.error("Translations not loaded yet");
        return;
    }

    renderHistoriaMenu(container);
    updateLangUI();
}

function showHistoria(sectionId) {
    currentView = `history-detail-${sectionId}`;
    const container = document.getElementById("historia-container");
    const section = translations.history.sections[sectionId];

    container.innerHTML = `
        <h1 class="text-5xl my-10">${section.title}</h1>
        ${section.content.map(block => {
        if (block.type === "paragraph")
            return `<p class="mb-12">${block.p}</p>`;

        if (block.type === "text-image")
            return `<div class="grid grid-cols-2 gap-8 mb-12 items-center">
                    <p>${block.p}</p>
                    <img src="${block.img}" class="w-full">
                </div>`;

        if (block.type === "image-text")
            return `<div class="grid grid-cols-2 gap-8 mb-12 items-center">
                    <img src="${block.img}" class="w-full">
                    <p>${block.p}</p>
                </div>`;
        if (block.type === "image")
            return `<img src="${block.img}" class="w-full mb-12">`
    }).join("")}
    `;
}